import React, {ReactHTML} from "react";
import {HasUUID, IPotntApi, Pothole, PotntApi, Road} from "api/potntApi";
import "style/main.scss"
import {Dialog, DialogProps} from "./dialog";

type MainViewProps = {
    api: IPotntApi,
    tenant: string,
    logout: () => void,
}

type MainViewState = {
    activeDialog: React.ClassType<DialogProps, any, any> | undefined;
    activeDialogProps: DialogProps | undefined
}

type AppControls = {
    displayDialog: (dialog: React.ClassType<DialogProps, any, any>, props: any) => void;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

    constructor(props: Readonly<MainViewProps> | MainViewProps) {
        super(props);
        this.state = {
            activeDialog: undefined,
            activeDialogProps: undefined
        }
    }

    displayDialog(dialog: React.ClassType<DialogProps, any, any>, props: DialogProps) {
        props.onQuit = this.closeDialog.bind(this);
        this.setState({
            activeDialog: dialog,
            activeDialogProps: props
        })
    }

    appControls = {
        displayDialog: this.displayDialog.bind(this)
    }

    closeDialog() {
        this.setState({
            activeDialog: undefined
        })
    }

    render() {
        return <div id="mainView">
            <div id="mainContent"
                 className={this.state.activeDialog != undefined ? "contentUnfocused" : ""}>
                <TopBarView logout={this.props.logout} tenantName={this.props.tenant} />
                <DynamicPotholeList appControls={this.appControls} api={this.props.api} />
            </div>
            {this.state.activeDialog != undefined ? React.createElement(this.state.activeDialog, this.state.activeDialogProps): ""}
        </div>;
    }
}

type TopBarProps = {
    tenantName: string,
    logout: () => void
}

class TopBarView extends React.Component<TopBarProps> {

    render() {
        return <div id="topBar">
            <p id="appName">Potn't</p>
            <p id="user">{this.props.tenantName} (<a className="logoutButton" onClick={this.props.logout}>logout</a>)</p>
        </div>
    }
}

function buildRoadTitle(r: Road): string {
    return r.name
}

function buildPotholeTitle(p: Pothole): string {
    return `${p.depth}cm deep hole at ${p.coordinates.latitude}, ${p.coordinates.longitude}`
}

type DynamicPotholeListProps = {
    api: IPotntApi
    appControls: AppControls
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
        this.reload()
    }

    render() {
        return <div id="potholeDynamicList" >
            <DynamicList<Road> allowAdd={true} onAdd={this.addRoad.bind(this)} id="roadList" loading={this.state.roadsLoading} elements={this.state.roads} selected={this.state.road} updateSelection={this.updateRoad.bind(this)} titleBuilder={buildRoadTitle} />
            <DynamicList<Pothole> allowAdd={false} id="potholeList" loading={this.state.potholesLoading} elements={this.state.potholes} selected={this.state.pothole} updateSelection={this.updatePothole.bind(this)} titleBuilder={buildPotholeTitle} />
            <PotholeViewer api={this.props.api} pothole={this.state.pothole} refresh={this.potholeRefresh.bind(this)}/>
        </div>
    }

    potholeRefresh(del: boolean) {
        if (del) {
            this.props.appControls.displayDialog(ConfirmDeleteDialog, {
                onDelete: (dialog: ConfirmDeleteDialog) => {
                    if (this.state.pothole != undefined) {
                        this.props.api.deletePothole(this.state.pothole.uuid).then(() => {
                            this.updateRoad(this.state.road!)
                            dialog.quit();
                        });
                    } else {
                        dialog.quit();
                    }
                }
            });
        } else {
            this.updateRoad(this.state.road!)
        }
    }

    addRoad() {
        this.props.appControls.displayDialog(AddRoadDialog, {
            onAdd: (name: string, dialog: AddRoadDialog) => {
                this.props.api.addRoad(name).then(() => {
                    this.reload();
                    dialog.quit();
                })
            }
        })
    }

    reload() {
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
    id: string;
    allowAdd: boolean
    onAdd?: (() => void)
}

class DynamicList<T extends HasUUID> extends React.Component<DynamicListProps<T>> {
    render() {
        return <div className="dynamicList" id={this.props.id}>
            {
                (this.props.elements != undefined) ? <div>
                    { this.props.elements.map((element, i) =>
                        <div key={element.uuid}
                             className={"listItem" +
                                ((this.props.selected === element) ? " listItemSelected" : "") +
                                ((i % 2 == 0) ? " listItemEven" : " listItemOdd")
                             }
                             onClick={_ => this.props.updateSelection(element)}>
                            {this.props.titleBuilder(element)}
                        </div>
                    )}
                    {this.props.allowAdd ?
                    <div key={"_addElement"} className="listItemAdd listItem" onClick={this.props.onAdd}>
                        +
                    </div> : ""
                    }
                </div> : (this.props.loading) ? "Loading...." : ""}
        </div>;
    }
}

type PotholeViewerProps = {
    pothole: Pothole | undefined,
    refresh: (deleted: boolean) => void,
    api: IPotntApi
}

type PotholeViewerState = {
    editing: boolean,
    pothole?: Pothole
}

class PotholeViewer extends React.Component<PotholeViewerProps, PotholeViewerState> {


    constructor(props: Readonly<PotholeViewerProps> | PotholeViewerProps) {
        super(props);
        this.state = {
            editing: false
        }
    }

    render() {
        return (this.props.pothole == undefined) ? "" :
            <div id="potholeViewer">
                <h2>{buildPotholeTitle(this.props.pothole)}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Latitude</td>
                            <td>{this.props.pothole.coordinates.latitude}</td>
                        </tr>
                        <tr>
                            <td>Longitude</td>
                            <td>{this.props.pothole.coordinates.longitude}</td>
                        </tr>
                        <tr>
                            <td>Length</td>
                            <td>{ (!this.state.editing ? this.props.pothole.length :
                                <input type="number" min={0} value={this.state.pothole?.length} onChange={e => this.updateLength(e.target.value)} /> )
                            } cm</td>
                        </tr>
                        <tr>
                            <td>Width</td>
                            <td>{ (!this.state.editing ? this.props.pothole.width :
                                <input type="number" min={0} value={this.state.pothole?.width} onChange={e => this.updateWidth(e.target.value)} /> )
                            } cm</td>
                        </tr>
                        <tr>
                            <td>Depth</td>
                            <td>{ (!this.state.editing ? this.props.pothole.depth :
                                <input type="number" min={0} value={this.state.pothole?.depth} onChange={e => this.updateDepth(e.target.value)} /> )
                            } cm</td>
                        </tr>
                        <tr>
                            <td>Image</td>
                            <td><img className="potholeImage" alt="provided image" src={this.props.api.getImageUrl(this.props.pothole.uuid)}/></td>
                        </tr>
                    </tbody>
                </table>

                <h3>Actions</h3>

                { this.state.editing ? <button onClick={this.save.bind(this)}>Save</button> : <button onClick={this.edit.bind(this)}>Edit</button> }
                <button onClick={_ => this.props.refresh(true)}>Delete</button>
            </div>
    }

    edit() {
        this.setState({
            editing: true,
            pothole: this.props.pothole
        });
    }

    async save() {
        this.setState({
            editing: false
        })
        await this.props.api.updatePothole(this.state.pothole!)
        this.props.refresh(false)
    }

    updateLength(length: string) {
        let p = this.state.pothole;
        p!.length = parseFloat(length);
        this.setState({
            pothole: p
        });
    }

    updateWidth(width: string) {
        let p = this.state.pothole;
        p!.width = parseFloat(width);
        this.setState({
            pothole: p
        });
    }

    updateDepth(depth: string) {
        let p = this.state.pothole;
        p!.depth = parseFloat(depth);
        this.setState({
            pothole: p
        });
    }
}

type AddRoadDialogProps = {
    onQuit?: () => void;
    onAdd: (name: string, dialog: AddRoadDialog) => void;
}

type AddRoadDialogState = {
    name: string
}

class AddRoadDialog extends Dialog<AddRoadDialogProps, AddRoadDialogState> {

    constructor(props: AddRoadDialogProps, context: any) {
        super(props, context);
        this.state = {
            name: ""
        }
    }

    renderContent(): JSX.Element {
        return <div>
            Name: <input type="text" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
            <button onClick={_ => this.props.onAdd(this.state.name, this)}>Create</button>
        </div>
    }
}

type ConfirmDeleteProps = {
    onQuit?: () => void;
    onDelete: (dialog: ConfirmDeleteDialog) => void;
}

type ConfirmDeleteState = {}

class ConfirmDeleteDialog extends Dialog<ConfirmDeleteProps, ConfirmDeleteState> {

    constructor(props: ConfirmDeleteProps, context: any) {
        super(props, context);
    }

    renderContent(): JSX.Element {
        return <div>
            Do you really want to delete this pothole?
            <button onClick={_ => this.props.onDelete(this)}>Yes</button>
            <button onClick={_ => this.quit()}>Abort</button>
        </div>
    }
}


