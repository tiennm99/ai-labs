package com.gameserver;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GameWebSocketHandler extends SimpleChannelInboundHandler<WebSocketFrame> {
    private static final Logger logger = LoggerFactory.getLogger(GameWebSocketHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) {
        if (frame instanceof TextWebSocketFrame) {
            String text = ((TextWebSocketFrame) frame).text();
            try {
                GameMessage message = objectMapper.readValue(text, GameMessage.class);
                logger.info("Received message: {}", message);
                
                // Create response message
                GameMessage response = new GameMessage("SERVER_RESPONSE", "Received: " + message.getType());
                String responseJson = objectMapper.writeValueAsString(response);
                ctx.channel().writeAndFlush(new TextWebSocketFrame(responseJson));
            } catch (Exception e) {
                logger.error("Error processing message: {}", e.getMessage());
                ctx.channel().writeAndFlush(new TextWebSocketFrame("Error processing message"));
            }
        } else {
            String message = "Unsupported frame type: " + frame.getClass().getName();
            throw new UnsupportedOperationException(message);
        }
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        logger.info("Client connected: {}", ctx.channel().remoteAddress());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        logger.info("Client disconnected: {}", ctx.channel().remoteAddress());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Channel exception: {}", cause.getMessage());
        ctx.close();
    }
}
