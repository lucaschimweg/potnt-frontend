import React, {ChangeEvent} from "react";
import {Pothole, PotntApi, PotntSignupApi, Road} from "../api/potntApi";

type SignupViewProps = {
    api: PotntApi,
    roads: Road[],
    tenant: string,
}

type SignupViewState = {
    error: string,
    pothole: Pothole,
    image: File | undefined,
}

export default class ReportView extends React.Component<SignupViewProps, SignupViewState> {


    constructor(props: Readonly<SignupViewProps> | SignupViewProps) {
        super(props);
        this.state = {
            error: "",
            pothole: {
                road: {
                    name: "",
                    uuid: (this.props.roads.length >= 1) ? this.props.roads[0].uuid : "",
                },
                uuid: "",
                length: 0,
                width: 0,
                depth: 0,
                coordinates: {
                    latitude: -1,
                    longitude: -1
                }
            },
            image: undefined
        }
    }

    render() {
        return <div>
            <h1>Report pothole in {this.props.tenant}</h1>
            {(this.state.error !== "") ? this.state.error : ""}
            <table>
                <tbody>
                <tr>
                    <td>Road</td>
                    <td>
                        <select value={this.state.pothole.road.uuid} onChange={e => this.updateRoad(e.target.value)}>{
                            this.props.roads.map(r => <option key={r.uuid} value={r.uuid}>{r.name}</option>)
                        }</select>
                    </td>
                </tr>
                <tr>
                    <td>Length</td>
                    <td><input type="number" min={0} value={this.state.pothole.length} onChange={e => this.updateLength(e.target.value)} /> cm </td>
                </tr>
                <tr>
                    <td>Width</td>
                    <td><input type="number" min={0} value={this.state.pothole.width} onChange={e => this.updateWidth(e.target.value)} /> cm</td>
                </tr>
                <tr>
                    <td>Length</td>
                    <td><input type="number" min={0} value={this.state.pothole.depth} onChange={e => this.updateDepth(e.target.value)} /> cm</td>
                </tr>
                <tr>
                    <td>Coordinates</td>
                    <td>({this.state.pothole.coordinates.latitude}, {this.state.pothole.coordinates.longitude}) <button onClick={this.getLocation.bind(this)}>Use current location</button></td>
                </tr>
                <tr>
                    <td>Image</td>
                    <td><input type="file" onChange={e => this.setState({
                        image: (e.target.files != null && e.target.files.length > 0) ? e.target.files[0] : undefined
                    })} /></td>
                </tr>
                </tbody>
            </table>
            <button onClick={this.send.bind(this)}>Save</button>
        </div>;
    }

    updateRoad(uuid: string) {
        let p = this.state.pothole;
        p.road.uuid = uuid;
        this.setState({
            pothole: p
        });
    }

    updateLength(length: string) {
        let p = this.state.pothole;
        p.length = parseFloat(length);
        this.setState({
            pothole: p
        });
    }

    updateWidth(width: string) {
        let p = this.state.pothole;
        p.width = parseFloat(width);
        this.setState({
            pothole: p
        });
    }

    updateDepth(depth: string) {
        let p = this.state.pothole;
        p.depth = parseFloat(depth);
        this.setState({
            pothole: p
        });
    }

    getLocation() {
        if (!navigator.geolocation) {
            this.setState({error: "Location fetching not supported in this browser!"});
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            let p = this.state.pothole;
            p.coordinates.latitude = position.coords.latitude;
            p.coordinates.longitude = position.coords.longitude;
            this.setState({pothole: p});
        }, positionError => {
            console.log(positionError)
            this.setState({error: "Error fetching location"})
        })
    }

    async send() {
        if (this.state.pothole.road.uuid == "") {
            this.setState({
                error: "Please specify road"
            })
        }

        let res = await this.props.api.addPothole(this.state.pothole)
        if (res == undefined) {
            this.setState({error: "Error storing location!"});
            return;
        }
        if (this.state.image != undefined) {
            let ok = await this.props.api.setPotholeImage(res.uuid, this.state.image)
            if (!ok) {
                this.setState({error: "Error storing image!"});
            }
        }

        this.setState({
            pothole: {
                road: {
                    name: "",
                    uuid: (this.props.roads.length >= 1) ? this.props.roads[0].uuid : "",
                },
                uuid: "",
                length: 0,
                width: 0,
                depth: 0,
                coordinates: {
                    latitude: -1,
                    longitude: -1
                }
            },
            image: undefined
        });
    }
}
