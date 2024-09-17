import { Router, Request, Response } from 'express';
import { newListingChartController, averageRevenueChartController, tableDataController } from './app.controller'
const router = Router();

router.get('/new-listings', async (req: Request, res: Response) => {
    const template = await newListingChartController()

    res.set('Content-Type', 'text/html');
    res.send(template)
});

router.get('/average-revenue', async (req: Request, res: Response) => {
    const template = await averageRevenueChartController()
    
    res.set('Content-Type', 'text/html');
    res.send(template)
});

router.get('/data-table', async (req: Request, res: Response) => {
    const sort = req.query.sort
    const direction = req.query.direction
    
    const template = await tableDataController(sort, direction)
    
    res.set('Content-Type', 'text/html');
    res.send(template)
});

export default router;