import { PopulatedDoc } from "mongoose";
import { ProfileDoc } from "../models/profileModel";
import { TeamDoc } from "../models/teamModel";

export type Participant = PopulatedDoc<ProfileDoc> | PopulatedDoc<TeamDoc>;