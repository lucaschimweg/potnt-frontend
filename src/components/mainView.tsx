import React from "react";
import {HasUUID, Pothole, PotntApi, Road} from "../api/potntApi";

type MainViewProps = {
    api: PotntApi
}

type MainViewState = {

}

export default class MainView extends React.Component<MainViewProps, MainViewState> {


    constructor(props: Readonly<MainViewProps> | MainViewProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    render() {
        return <div>
            <TopBarView tenantName={""} />
            <DynamicPotholeList api={this.props.api} />
        </div>;
    }
}

type TopBarProps = {
    tenantName: string
}

class TopBarView extends React.Component<TopBarProps> {

    render() {
        return <div>
            <p>Potn't</p>
            <p>{this.props.tenantName} (<a>logout</a>)</p>
        </div>
    }
}

function buildRoadTitle(r: Road): string {
    return r.name
}

function buildPotholeTitle(p: Pothole): string {
    return `${p.depth}cm deep hole at ${p.coordinate.latitude}, ${p.coordinate.longitude}`
}

type DynamicPotholeListProps = {
    api: PotntApi
}

type DynamicPotholeListState = {
    roads: Road[] | undefined,
    road: Road | undefined,
    potholes: Pothole[] | undefined
    pothole: Pothole | undefined
}

class DynamicPotholeList extends React.Component<DynamicPotholeListProps, DynamicPotholeListState> {

    constructor(props: Readonly<DynamicPotholeListProps> | DynamicPotholeListProps) {
        super(props);
        this.state = {
            roads: undefined,
            road: undefined,
            potholes: undefined,
            pothole: undefined
        }
        this.props.api.getRoads().then((roads) => {
            if (roads == undefined) {
                alert("Error loading!");
            }

            this.setState({
                roads: roads
            });
        });
    }

    render() {
        return <div>
            <DynamicList<Road> elements={this.state.roads} selected={this.state.road} updateSelection={this.updateRoad.bind(this)} titleBuilder={buildRoadTitle} />
            <DynamicList<Pothole> elements={this.state.potholes} selected={this.state.pothole} updateSelection={this.updatePothole.bind(this)} titleBuilder={buildPotholeTitle} />
            <PotholeViewer pothole={this.state.pothole} />
        </div>
    }

    updateRoad(road: Road) {
        this.setState({
            road: road,
            potholes: undefined,
            pothole: undefined
        });
        this.props.api.getPotholesOnRoad(road.uuid).then((potholes) => {
            if (potholes == undefined) {
                alert("Error loading!");
            }

            this.setState({
                potholes: potholes,
                pothole: undefined
            });
        })
    }

    updatePothole(pothole: Pothole) {
        this.setState({
            pothole: pothole
        })
    }
}

type DynamicListProps<T> = {
    elements: T[] | undefined
    selected: T | undefined
    updateSelection: (element: T) => void;
    titleBuilder: (element: T) => string;
}

class DynamicList<T extends HasUUID> extends React.Component<DynamicListProps<T>> {
    render() {
        return <div>
            { (this.props.elements != undefined) ? this.props.elements.map((element) =>
                <div id={element.uuid} className={(this.props.selected === element) ? "selected" : "" }>
                    this.props.titleBuilder(element)
                </div>
            ) : "Loading...."}
        </div>;
    }
}

type PotholeViewerProps = {
    pothole: Pothole | undefined
}

class PotholeViewer extends React.Component<PotholeViewerProps> {

    render() {
        return (this.props.pothole == undefined) ? "" :
            <div>
                <h2>{buildPotholeTitle(this.props.pothole)}</h2>
                <table>
                    <tr>
                        <td>Latitude</td>
                        <td>{this.props.pothole.coordinate.latitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>{this.props.pothole.coordinate.longitude}</td>
                    </tr>
                    <tr>
                        <td>Length</td>
                        <td>{this.props.pothole.length}</td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td>{this.props.pothole.width}</td>
                    </tr>
                    <tr>
                        <td>Depth</td>
                        <td>{this.props.pothole.depth}</td>
                    </tr>
                </table>

                <h3>Actions</h3>
                <button>Edit</button>
                <button>Delete</button>
            </div>
    }
}
