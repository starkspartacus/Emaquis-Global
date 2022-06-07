const { employeQueries } = require('../requests/EmployeQueries');

exports.employelogin = async (req, res) => {
  
    try{
         
    }catch (e) {
         console.log('err', e);
         res.redirect(e)
     }
 };
 exports.employeloginPost = async (req, res) => {
   
     try{
        const tab =[];
        const data = req.body;
        console.log(data);
        const Result = await employeQueries.getAllEmploye()
        const rr = Result.result
        rr.forEach(element => {
          if(element.email ==data.email && element.password ==data.password){
            tab.push(element)
            res.status(200).send({ data: tab, success: true });
          } 
      });

      if(tab == ""){
        res.status(400).send({ data: "email ou mot de passe incorrect", success: false });
      }
    }catch (e) {
        console.log('err', e);
        res.status(400).send({ data: "verifiez les champs", success: false });
        
    }
};
