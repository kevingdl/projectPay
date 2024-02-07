//reference: https://www.youtube.com/watch?v=GQStVI5qbLI

const { FullConfig } = require('@playwright/test');
import dotenv from 'dotenv'

export default async config => {
    if (process.env.SelectEnv){
        dotenv.config({
            path: `.env.${process.env.SelectEnv}`,
            override:true
        })
    }
}