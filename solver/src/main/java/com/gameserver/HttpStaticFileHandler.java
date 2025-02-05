package com.gameserver;

import io.netty.channel.*;
import io.netty.handler.codec.http.*;
import io.netty.handler.stream.ChunkedFile;
import io.netty.handler.ssl.SslHandler;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import static io.netty.handler.codec.http.HttpHeaderNames.*;
import static io.netty.handler.codec.http.HttpHeaderValues.KEEP_ALIVE;
import static io.netty.handler.codec.http.HttpResponseStatus.*;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

public class HttpStaticFileHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private final String staticPath;

    public HttpStaticFileHandler(String staticPath) {
        this.staticPath = staticPath;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        if (!request.decoderResult().isSuccess()) {
            sendError(ctx, BAD_REQUEST);
            return;
        }

        if (!HttpMethod.GET.equals(request.method())) {
            sendError(ctx, METHOD_NOT_ALLOWED);
            return;
        }

        final String uri = request.uri();
        final String path = sanitizeUri(uri);
        if (path == null) {
            sendError(ctx, FORBIDDEN);
            return;
        }

        File file = new File(staticPath + path);
        if (!file.exists()) {
            sendError(ctx, NOT_FOUND);
            return;
        }

        if (file.isDirectory()) {
            if (uri.endsWith("/")) {
                file = new File(file, "index.html");
            } else {
                sendRedirect(ctx, uri + '/');
                return;
            }
        }

        if (!file.isFile()) {
            sendError(ctx, FORBIDDEN);
            return;
        }

        try {
            RandomAccessFile raf = new RandomAccessFile(file, "r");
            long fileLength = raf.length();

            HttpResponse response = new DefaultHttpResponse(HTTP_1_1, OK);
            HttpUtil.setContentLength(response, fileLength);
            setContentTypeHeader(response, file);

            if (HttpUtil.isKeepAlive(request)) {
                response.headers().set(CONNECTION, KEEP_ALIVE);
            }

            ctx.write(response);
            ChannelFuture sendFileFuture = ctx.write(new ChunkedFile(raf, 0, fileLength, 8192),
                    ctx.newProgressivePromise());
            ChannelFuture lastContentFuture = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);

            if (!HttpUtil.isKeepAlive(request)) {
                lastContentFuture.addListener(ChannelFutureListener.CLOSE);
            }
        } catch (FileNotFoundException fnfe) {
            sendError(ctx, NOT_FOUND);
        }
    }

    private static void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
        FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, status);
        response.headers().set(CONTENT_TYPE, "text/plain; charset=UTF-8");
        response.content().writeBytes(status.toString().getBytes(StandardCharsets.UTF_8));

        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private static void sendRedirect(ChannelHandlerContext ctx, String newUri) {
        FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, FOUND);
        response.headers().set(LOCATION, newUri);

        ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }

    private static String sanitizeUri(String uri) {
        try {
            uri = URLDecoder.decode(uri, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException e) {
            try {
                uri = URLDecoder.decode(uri, StandardCharsets.ISO_8859_1.name());
            } catch (UnsupportedEncodingException ex) {
                throw new Error(ex);
            }
        }

        if (!uri.startsWith("/")) {
            return null;
        }

        uri = uri.replace('/', File.separatorChar);
        if (uri.contains(File.separator + '.') ||
            uri.contains('.' + File.separator) ||
            uri.startsWith(".") || uri.endsWith(".") ||
            uri.contains("..")) {
            return null;
        }

        return uri;
    }

    private static void setContentTypeHeader(HttpResponse response, File file) {
        String name = file.getName().toLowerCase();
        if (name.endsWith(".html") || name.endsWith(".htm")) {
            response.headers().set(CONTENT_TYPE, "text/html; charset=UTF-8");
        } else if (name.endsWith(".css")) {
            response.headers().set(CONTENT_TYPE, "text/css; charset=UTF-8");
        } else if (name.endsWith(".js")) {
            response.headers().set(CONTENT_TYPE, "application/javascript; charset=UTF-8");
        } else if (name.endsWith(".json")) {
            response.headers().set(CONTENT_TYPE, "application/json; charset=UTF-8");
        } else {
            response.headers().set(CONTENT_TYPE, "application/octet-stream");
        }
    }
}
