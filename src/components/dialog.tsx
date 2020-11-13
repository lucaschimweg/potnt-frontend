import React from "react";

export type DialogProps = {
    onQuit?: () => void;
}

export class Dialog<Props extends DialogProps, State> extends React.Component<Props, State> {

    render() {
        return <div className="dialog">
            <div className="dialogHeader">
                <div className="dialogQuit" onClick={this.props.onQuit}>
                    X
                </div>
            </div>
            { this.renderContent() }
        </div>
    }

    quit() {
        if (this.props.onQuit != undefined) {
            this.props.onQuit();
        }
    }

    renderContent() : JSX.Element {
        return <div />
    }
}
