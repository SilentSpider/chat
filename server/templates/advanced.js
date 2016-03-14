
$(function(){
    var ref = window.parent.document.getElementById('advframe');

    $('#msg').keyup(function(event) {
        if ( event.which === 13 ) {
            ref.contentDocument.emit($('#msg').val());
            $('#msg').val('');
            if($('#file').val()) {
                var uploadId = "u" + getMs();
                var html = '<iframe name="' + uploadId + '" frameborder="0" width="1" height="1"></iframe>';
                $('.achat').append(html);
                $('#post').prop("target", uploadId);
                $('#uploadId').val(uploadId);
                $('#post').submit();
                $('#file').val('');
            }
        }
    });

    $(".achat").animate({scrollTop: $(".achat").prop('scrollHeight')}, "slow");

    ref.contentDocument.onincoming(function(msg) {
        var you = "";
        if(msg.u === '{{user}}') {
            you = " you";
        }
        var html = '<div class="messageBox' + you + '">' +
            '<div class="messageInline messageNick ossFont">' + msg.u + '</div>' +
            '<div class="messageInline messageTime ossFont">' + format(msg.t) + '</div>' +
            '<div class="messageTextCont">';

            if(msg.m) {
                html += '<span class="messageText ossFont">' + msg.m + '</span>';
            }
            if(msg.f) {
                html += '<span class="messageText messageFile redBackground ossFont"><a href="file/'
                    + msg.t + '?name=' + msg.f + '">' + msg.f + '</a></span>';
            }
            html += '</div></div>';

        $('.achat').append(html);
        $(".achat").animate({scrollTop: $(".achat").prop('scrollHeight')}, "slow");
    });

    function getMs() {
        return Math.floor(new Date().getTime() / 1000);
    }

    function format(timestamp) {
        var now = getMs();
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
});