import {IPotntApi, Pothole, Road} from "./potntApi";

const roads: Road[] = [
    {
        uuid: "r1",
        name: "Road 1"
    },
    {
        uuid: "r2",
        name: "Road 2"
    },
    {
        uuid: "r3",
        name: "Road 3"
    }
];

const potholes: { [road: string]: Pothole[] } = {
    "r1": [
        {
            depth: 5,
            width: 5,
            length: 5,
            coordinates: {
                longitude: 123,
                latitude: 123
            },
            uuid: "h1",
            road: roads[0]
        },
        {
            depth: 1,
            width: 2,
            length: 3,
            coordinates: {
                longitude: 124,
                latitude: 124
            },
            uuid: "h2",
            road: roads[0]
        }
    ],
    "r2": [
        {
            depth: 5,
            width: 6,
            length: 5,
            coordinates: {
                longitude: 53,
                latitude: 32
            },
            uuid: "h3",
            road: roads[1]
        },
        {
            depth: 5,
            width: 4,
            length: 2,
            coordinates: {
                longitude: 125,
                latitude: 1
            },
            uuid: "h4",
            road: roads[1]
        }
    ],
    "r3": []
};


export class DummyPotntApi implements IPotntApi {
    async addRoad(name: string): Promise<Road | undefined> {
        let road = {
            uuid: name,
            name: name
        }
        roads.push(road);
        potholes[name] = []
        return road;
    }

    addPothole(pothole: Pothole): Promise<Pothole | undefined> {
        return Promise.resolve(undefined);
    }

    async deletePothole(uuid: string): Promise<boolean> {
        for (let key in potholes) {
            potholes[key] = potholes[key].filter(p => p.uuid != uuid)
        }
        return true
    }

    getPothole(uuid: string): Promise<Pothole | undefined> {
        return Promise.resolve(undefined);
    }

    getPotholesOnRoad(uuid: string): Promise<Pothole[] | undefined> {
        return Promise.resolve(potholes[uuid]);
    }

    getRoads(): Promise<Road[] | undefined> {
        return Promise.resolve(roads);
    }

    login(username: string, password: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    updatePothole(pothole: Pothole): Promise<Pothole | undefined> {
        return Promise.resolve(undefined);
    }

    getImageUrl(uuid: string): string {
        return "https://example.com/image.png";
    }

}