
import { Response,Request, response } from "express";
import { getAllDetailsForVenue, getAllVenueServices, getVenueByIdServices, searchVenuesByName } from "./venue.service";

export const GetAllVenues = async(req: Request, res: Response) =>{
    try {
        const AllVenues = await getAllVenueServices();
        if(!AllVenues || AllVenues.length === 0){
            res.status(404).json({message: "No Venues Found😔"});
        }
        else{
            res.status(200).json(AllVenues)
        }
    } catch (error: any) {
        res.status(500).json({error: error.message || "Error Occured! Failed To Fetch Venue 😥"})        
    }
}

export const getVenueByName = async (req: Request, res: Response)=>{
   const VenueName =  req.params.name;   
   try {
    const venueBYName = await getVenueByIdServices(VenueName);
    if(!venueBYName){
        res.status(404).json({message: "No venue Found 😔"})
    }
    else{
        res.status(200).json(venueBYName)
    }
   } catch (error: any) {
    res.status(500).json({error: error.message || "error Occured! Failed To Fetch Venue😥"})
   }
}

// Search venue by Name
export const searchVenue = async(req: Request,res: Response) => {
    const searchName = req.query.name as string;
    if(!searchName){
        res.status(400).json({error: "Missing Name query parameter"});
        return;
    }
    try {
        const searchVenueDetails = await searchVenuesByName(searchName)
        if(!searchVenueDetails || searchVenueDetails.length === 0){
            res.status(404).json({message: "No Venue Found With That Name😔"});
        }else{
            res.status(200).json(searchVenueDetails);
        }
    } catch (error: any) {
        res.status(500).json({error: error.message || "Errror Occured Failed to fearch Venue😥"})
    }
}

export const venueDetails = async (req: Request, res: Response) =>{
    const venueName = req.query.name as string;
    if(!venueName){
        res.status(400).json({error: "Missing Name query parameter🥲"});
        return;
    }
    try {
        const venue_Details = await getAllDetailsForVenue(venueName);
        if(!venue_Details ){
            res.status(404).json("No Venue Name Like That...Try Again🥲")
        }else{
            res.status(200).json(venue_Details);
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "Error Occured...Failed To Fetch Venue Details🥲"});
    }
}