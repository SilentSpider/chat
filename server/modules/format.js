module.exports = function() {

    return {
        time: function(timestamp) {
            var now = Math.floor(new Date().getTime() / 1000);
            var secondsAgo = now - timestamp;

            if(secondsAgo <= 120) {
                return "Just now";
            }
            if(secondsAgo <= 60 * 60 * 2) {
                return Math.floor(secondsAgo/60) + " minutes ago";
            }
            if(secondsAgo <= 60 * 60 * 24 * 2) {
                return Math.floor(secondsAgo/(60*60)) + " hours ago";
            }
            if(secondsAgo <= 60 * 60 * 24 * 7 * 2) {
                return Math.floor(secondsAgo/(60*60*24)) + " days ago";
            }
            if(secondsAgo <= 60 * 60 * 24 * 30 * 2) {
                return Math.floor(secondsAgo/(60*60*24*7)) + " weeks ago";
            }
            if(secondsAgo <= 60 * 60 * 24 * 365 * 2) {
                return Math.floor(secondsAgo/(60*60*24*30)) + " months ago";
            }
            return Math.floor(secondsAgo/(60*60*24*365)) + " years ago";
        }
    }
}