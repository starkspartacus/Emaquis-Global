require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('../models/user.model');

exports.authUser =async (req,res,next)=>{
    const token = req.headers.token;
    if(!!!token){
        res.status(404).send({error:'token not find'});
        return
    }
    try{
        const tokenExist = await User.findOne({token:token});
        if(tokenExist){
            const data = jwt.verify(token,secret);
            req.user = {
                id:tokenExist._id,
                folders:tokenExist.folders,
                role:tokenExist.role
            }
            if(data){
                next();
            }else{
                
                res.status(401).send({error:"error signature"})
            }
        }else{
            res.status(404).send({error:"Token not find"})
            return;
        } 
    }catch(err){
        res.status(404).send({error:err.message})
        return
    } 
}


exports.authAdmin =async (req,res,next)=>{
    const token = req.headers.token;
    if(!!!token){
        res.status(404).send({error:'token not find'});
        return
    }
    try{
        const tokenExist = await User.findOne({token:token});
        if(tokenExist && tokenExist.role === "ROLE_ADMIN"){
            const data = jwt.verify(token,secret);
            req.user = {
                id:tokenExist._id,
                folders:tokenExist.folders,
                role:tokenExist.role
            }
            if(data){
                next();
            }else{
                res.status(401).send({error:"error signature"})
            }
        }else{
            res.status(404).send({error:"you are don't accès to this route"})
            return;
        } 
    }catch(err){
        res.status(404).send({error:err.message})
        return
    }  
}