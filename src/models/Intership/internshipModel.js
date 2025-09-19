import internshipCollection from "./internshipSchema.js";


export const createIntership =async (obj)=> await internshipCollection(obj).save()


