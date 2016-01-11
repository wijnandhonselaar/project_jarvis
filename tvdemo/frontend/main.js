var React = require('react');
var ReactDOM = require('react-dom');

var LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.
            </p>
        );
    }
});

ReactDOM.render(
    <LikeButton />,
    document.getElementById('container')
);

var videoPlayer = React.createClass({
    getInitialState: function() {
        return {
            channel: 1
        };
    },
    switchChannel: function(newChan) {
        this.setState({
            channel: newChan
        });
    },
    getSource: function(){
        return "channel" + this.channel + ".mp4";
    },
    render: function() {
        return (
            <video src={this.getSource}></video>
        );
    }
});