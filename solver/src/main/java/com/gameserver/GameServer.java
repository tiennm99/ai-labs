package com.gameserver;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GameServer {
    private static final Logger logger = LoggerFactory.getLogger(GameServer.class);
    private final int port;
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;

    public GameServer(int port) {
        this.port = port;
    }

    public void start() throws Exception {
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();

        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            // HTTP codec for WebSocket handshake and static files
                            pipeline.addLast(new HttpServerCodec());
                            pipeline.addLast(new HttpObjectAggregator(65536));
                            
                            // Static file handler for serving the web client
                            pipeline.addLast(new HttpStaticFileHandler("src/main/resources/static"));
                            
                            // WebSocket protocol handler
                            pipeline.addLast(new WebSocketServerProtocolHandler("/game", null, true));
                            
                            // Game handler for WebSocket frames
                            pipeline.addLast(new GameWebSocketHandler());
                        }
                    });

            Channel channel = bootstrap.bind(port).sync().channel();
            logger.info("Game server started on port {}", port);
            channel.closeFuture().sync();
        } finally {
            shutdown();
        }
    }

    public void shutdown() {
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        logger.info("Game server shutdown complete");
    }

    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        GameServer server = new GameServer(port);
        try {
            server.start();
        } catch (Exception e) {
            logger.error("Failed to start game server", e);
        }
    }
}
