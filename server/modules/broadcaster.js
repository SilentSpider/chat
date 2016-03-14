module.exports = function (persist) {
    var roomSubscribers = {};
    setInterval(function () {
        for (room in roomSubscribers) {
            if (roomSubscribers.hasOwnProperty(room)) {
                var subscribers = roomSubscribers[room];
                if (subscribers) {
                    for (var i = 0; i < subscribers.length; i++) {
                        subscribers[i].heartbeat();
                    }
                }
            }
        }
    }, 10000);

    return {
        subscribe: function (room, subscriber) {
            var subscribers = roomSubscribers[room];
            if (!subscribers) {
                subscribers = [];
            }
            subscribers.push(subscriber);
            roomSubscribers[room] = subscribers;
            console.log("Subscribing to room: " + room);
        },
        unsubscribe: function (room, subscriber) {
            var subscribers = roomSubscribers[room];
            if (subscribers) {
                var subscriberIndexToRemove = -1;
                for (var i = 0; i < subscribers.length; i++) {
                    if (subscribers[i] === subscriber) {
                        subscriberIndexToRemove = i;
                    }
                }
                if (subscriberIndexToRemove == -1) {
                    console.log("Subscriber to remove not found");
                }
                else {
                    subscribers.splice(subscriberIndexToRemove, 1);
                    console.log("Removed subscriber " + subscriberIndexToRemove);
                }
            }
        },
        emit: function (msg, fileName, timestamp, room, user) {
            persist.addMsg(msg, fileName, room, user, timestamp);
            var subscribers = roomSubscribers[room];
            if (subscribers) {
                for (var i = 0; i < subscribers.length; i++) {
                    subscribers[i].message(msg, fileName, user, timestamp);
                    console.log("Sending message in " +
                        room + " : " + msg + " with file " + fileName + " by user " + user + " at " + timestamp);
                }
            }
            if (this.global) {
                var jsonMsg = {};
                jsonMsg.m = msg;
                jsonMsg.f = fileName;
                jsonMsg.t = timestamp;
                jsonMsg.r = room;
                jsonMsg.u = user;
                this.global.emit(room, jsonMsg);
            }
        },
        history: function (room) {
            return persist.getMsgs(room);
        },
        global: function (global) {
            this.global = global;
        }
    }
}