var React = require('react');
var ReactDOM = require('react-dom');
var io = require('socket.io-browserify');
var ding = io.connect('http://localhost:1337');

var VideoPlayer = React.createClass({
    getInitialState: function() {
        return {
            channel: 2
        };
    },
    switchChannel: function(newChan) {
        this.setState({
            channel: newChan
        });
    },
    render: function() {
        var src = "channel" + this.state.channel + ".mp4";

        setTimeout(function(){
            document.getElementById("video").play();
        }, 500);

        return (
            <video src={src} id="video"></video>
        );
    }
});

var Television = React.createClass({
    getInitialState: function() {
        return {
            on: true
        };
    },
    toggleState: function() {
        this.setState({
            on: !this.state.on
        });
    },
    render: function() {

        var self = this;
        ding.on('test', function () {
            alert("TEST");
        });

        return (
            <div>
                { this.state.on ? <VideoPlayer /> : null }
            </div>
        );
    }
});

ReactDOM.render(
    <Television />,
    document.getElementById('container')
);