package com.gameserver;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GameMessage {
    private final String type;
    private final String payload;

    @JsonCreator
    public GameMessage(
            @JsonProperty("type") String type,
            @JsonProperty("payload") String payload) {
        this.type = type;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public String getPayload() {
        return payload;
    }

    @Override
    public String toString() {
        return "GameMessage{" +
                "type='" + type + '\'' +
                ", payload='" + payload + '\'' +
                '}';
    }
}
