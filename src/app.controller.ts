import Handlebars from 'handlebars';
import fs from 'fs';

import DbClient from './db-client'
import { colors, chartYearMonthLabels } from './constants'

const sqlQueryChart = `
    SELECT 
        sites.id AS site_id,
        sites.title AS site_title,
        TO_CHAR(deals.listing_date, 'YYYY-MM') AS deal_listing_year_month,
        COALESCE(AVG(deals.revenue), 0) AS average_revenue,
        COUNT(deals.id) AS total_deals
    FROM 
        sites
    LEFT JOIN 
        deals ON sites.id = deals.site_id 
        AND deals.listing_date BETWEEN '2020-11-01' AND '2021-11-30'
        AND deals.removed = FALSE
    GROUP BY 
        sites.id, 
        TO_CHAR(deals.listing_date, 'YYYY-MM')
    ORDER BY 
        site_id ASC, 
        deal_listing_year_month ASC;
`

const queryParser = (queryData) => {
    const sitesDatesObject = queryData.reduce((result, item) => {
        const site_id = item['site_id'];
        if (!result[site_id]) {
            result[site_id] = [];
        }
        result[site_id].push(item);
        return result;
    }, {});
    return Object.values(sitesDatesObject)
}

export const newListingChartController = async () => {
    const dbClientPool = DbClient.getInstance().getConnection()

    const queryResponse = await dbClientPool.query(sqlQueryChart)
    const sitesDates = queryParser(queryResponse.rows)

    const datasets = sitesDates.map(siteDate => {      
        const sites = siteDate as Array<any>

        const label = sites[0].site_title
        const data = sites.map(site => parseInt(site.total_deals))
        const borderColor = colors[sites[0].site_id - 1]
        
        return {
            label,
            data,
            borderColor,
            fill: false,
            tension: 0.1
        }
    })

    const templateConfig = {
        labels: JSON.stringify(chartYearMonthLabels),
        datasets: JSON.stringify(datasets),
        title: 'New Listing Chart'
    }
    
    const chart = fs.readFileSync('src/chart.html')
    const template = Handlebars.compile(chart.toString());
    const templateCompiled = template(templateConfig)

    return templateCompiled
}

export const averageRevenueChartController = async () => {
    const dbClientPool = DbClient.getInstance().getConnection()

    const queryResponse = await dbClientPool.query(sqlQueryChart)
    const sitesDates = queryParser(queryResponse.rows)

    const datasets = sitesDates.map(siteDate => {  
        const sites = siteDate as Array<any>

        const label = sites[0].site_title
        const data = sites.map(site => parseInt(site.average_revenue))
        const borderColor = colors[sites[0].site_id - 1]
        
        return {
            label,
            data,
            borderColor,
            fill: false,
            tension: 0.1
        }
    })

    const templateConfig = {
        labels: JSON.stringify(chartYearMonthLabels),
        datasets: JSON.stringify(datasets),
        title: 'Average Revenue Chart'
    }
    
    const chart = fs.readFileSync('src/chart.html')
    const template = Handlebars.compile(chart.toString());
    const templateCompiled = template(templateConfig)

    return templateCompiled
}

export const tableDataController = async (
    sort = 'listing_id',
    direction = 'ASC'
) => {
    const dbClientPool = DbClient.getInstance().getConnection()

    const sqlQueryTable = `
        SELECT 
            deals.id AS listing_id,
            TO_CHAR(deals.listing_date, 'MM') AS listing_month,
            TO_CHAR(deals.listing_date, 'YYYY-MM-DD') AS listing_date,
            sites.title AS broker,
            deals.revenue AS revenue
        FROM 
            deals
        JOIN
            sites ON sites.id = deals.site_id 
        WHERE
            deals.listing_date BETWEEN '2020-11-01' AND '2021-11-30'
            AND deals.removed = FALSE
        ORDER BY 
            ${sort} ${direction}
    `
    
    const queryResponse = await dbClientPool.query(sqlQueryTable)
    
    const tableData = queryResponse.rows

    const templateConfig = {
        tableData,
        host: process.env.HOST
    }
    
    const table = fs.readFileSync('src/table.html')
    const template = Handlebars.compile(table.toString());
    const templateCompiled = template(templateConfig)

    return templateCompiled
}