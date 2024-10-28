const express=require('express')
const router=express.Router()

const projHandler=require('../router_handler/projs')

router.post('/all',projHandler.projAll)
router.post('/add',projHandler.projAdd)
router.post('/edit',projHandler.projEdit)
router.post('/delete',projHandler.projDelete)

router.post('/plus',projHandler.projPlus)

module.exports=router