import React from "react";
import {HasUUID, IPotntApi, Pothole, PotntApi, Road} from "api/potntApi";

type MainViewProps = {
    api: IPotntApi
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
    api: IPotntApi
}

type DynamicPotholeListState = {
    roadsLoading: boolean,
    roads: Road[] | undefined,
    road: Road | undefined,
    potholesLoading: boolean,
    potholes: Pothole[] | undefined
    pothole: Pothole | undefined
}

class DynamicPotholeList extends React.Component<DynamicPotholeListProps, DynamicPotholeListState> {

    constructor(props: Readonly<DynamicPotholeListProps> | DynamicPotholeListProps) {
        super(props);
        this.state = {
            roadsLoading: true,
            roads: undefined,
            road: undefined,
            potholesLoading: false,
            potholes: undefined,
            pothole: undefined
        }
        this.props.api.getRoads().then((roads) => {
            if (roads == undefined) {
                alert("Error loading!");
            }

            this.setState({
                roadsLoading: false,
                roads: roads
            });
        });
    }

    render() {
        return <div>
            <DynamicList<Road> loading={this.state.roadsLoading} elements={this.state.roads} selected={this.state.road} updateSelection={this.updateRoad.bind(this)} titleBuilder={buildRoadTitle} />
            <DynamicList<Pothole> loading={this.state.potholesLoading} elements={this.state.potholes} selected={this.state.pothole} updateSelection={this.updatePothole.bind(this)} titleBuilder={buildPotholeTitle} />
            <PotholeViewer pothole={this.state.pothole} />
        </div>
    }

    updateRoad(road: Road) {
        this.setState({
            road: road,
            potholesLoading: true,
            potholes: undefined,
            pothole: undefined
        });
        this.props.api.getPotholesOnRoad(road.uuid).then((potholes) => {
            if (potholes == undefined) {
                alert("Error loading!");
            }

            this.setState({
                potholesLoading: false,
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
    loading: boolean;
    titleBuilder: (element: T) => string;
}

class DynamicList<T extends HasUUID> extends React.Component<DynamicListProps<T>> {
    render() {
        return <div>
            { (this.props.elements != undefined) ? this.props.elements.map((element) =>
                <div key={element.uuid} className={(this.props.selected === element) ? "selected" : "" } onClick={_ => this.props.updateSelection(element)}>
                    {this.props.titleBuilder(element)}
                </div>
            ) : (this.props.loading) ? "Loading...." : ""}
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
                    <tbody>
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
                    </tbody>
                </table>

                <h3>Actions</h3>
                <button>Edit</button>
                <button>Delete</button>
            </div>
    }
}
