import axios from "axios";
import { Request, Response, } from "express";

export const getTodayImage = (req: Request, res: Response) => {
    axios
        .get(
            `https://api.nasa.gov/planetary/apod?api_key=Rb7gg4PDSDNrNrx7pIBh1SSBw9S5i2Da5x9dPOXC`
        )
        .then((response) => {
            console.log("resData", req.cookies["NDIC_token"], response.data);
            res.status(200).json(response.data);
        })
        .catch((err) => {
            throw new Error(err);
        });
}