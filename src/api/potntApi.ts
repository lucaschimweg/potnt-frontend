import RestfulApi from "./restfulApi";

export interface HasUUID {
    uuid: string;
}

export type Pothole = {
    uuid: string,
    length: number,
    width: number,
    depth: number,
    coordinates: Coordinates,
    road: Road,
}

export type Road = {
    uuid: string,
    name: string
}

export type Coordinates = {
    latitude: number,
    longitude: number
}

export class PotntSignupApi extends RestfulApi {
    constructor() {
        super("/api");
    }

    async signUp(username: string, password: string, name: string): Promise<PotntApi | undefined> {
        let res = await this.post("/signup", {
            username: username,
            password: password,
            name: name
        });

        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        let api = new PotntApi(name);
        api.bearerToken = res.result["bearerToken"];
        return api
    }
}

export interface IPotntApi {
    login(username: string, password: string): Promise<boolean>;
    getPothole(uuid: string): Promise<Pothole | undefined>;
    getRoads(): Promise<Road[] | undefined>;
    getPotholesOnRoad(uuid: string): Promise<Pothole[] | undefined>;
    deletePothole(uuid: string): Promise<boolean>;
    updatePothole(pothole: Pothole): Promise<Pothole | undefined>;
    addPothole(pothole: Pothole): Promise<Pothole | undefined>;
    addRoad(name: string): Promise<Road | undefined>;
}

export class PotntApi extends RestfulApi implements IPotntApi {

    constructor(tenant: string) {
        super(`/api/${tenant}`);
    }

    async login(username: string, password: string): Promise<boolean> {
        let res = await this.post("/login", {
            "username": username,
            "password": password
        });

        if (!(res.status == 200 && res.resultParsable)) {
            return false
        }

        this.bearerToken = res.result["bearerToken"]
        return true
    }

    async getPothole(uuid: string): Promise<Pothole | undefined> {
        let res = await this.get(`/pothole/${uuid}`);
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }

    async getRoads(): Promise<Road[] | undefined> {
        let res = await this.get(`/roads`);
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }

    async getPotholesOnRoad(uuid: string): Promise<Pothole[] | undefined> {
        let res = await this.get(`/roads/${uuid}/potholes`);
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }

    async deletePothole(uuid: string): Promise<boolean> {
        let res = await this.delete(`/pothole/${uuid}`);
        return (res.status == 200 && res.resultParsable);
    }

    async updatePothole(pothole: Pothole): Promise<Pothole | undefined> {
        let res = await this.put(`/pothole/${pothole.uuid}`, pothole);
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }

    async addPothole(pothole: Pothole): Promise<Pothole | undefined> {
        delete pothole.uuid
        let res = await this.post(`/pothole`, pothole);
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }

    async addRoad(name: string): Promise<Road | undefined> {
        let res = await this.post(`/roads`, {
            name: name
        });
        if (!(res.status == 200 && res.resultParsable)) {
            return undefined
        }

        return res.result
    }
}
