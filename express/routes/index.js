var express = require('express');
var router = express.Router();
var path = require('path');
// var cors = require('cors');
var fs = require('fs');
var multer = require('multer');
var uuid = require('node-uuid');

// var upload = multer({ 
// 	dest: path.resolve(__dirname,'../public/uploads/') ,
// 	// limits: 5*1024*1024,
// });
// 自定义multer存储
var uploadFolder = path.resolve(__dirname,'../public/uploads/');
var createFolder = (folder)=>{
	try{
		fs.accessSync(folder);
	}catch(e){
		fs.mkdirSync(folder);
	}
	return folder;
}
var storage = multer.diskStorage({
	destination: (req,file,cb)=>{
		cb(null,createFolder(path.resolve(uploadFolder,'./'+file.fieldname)));
	},
	filename: (req,file,cb)=>{
		var name = `${file.fieldname}-${uuid.v1()}.${file.originalname.split('.').pop()}`;
		cb(null,name);
	}
});
var upload = multer({storage:storage});

// apply cors on single router
	// var whitelist = ['http://project.com', 'http://example.com']
	// var corsOptions = {
	// 	origin: function (origin, callback) {
	// 		if (whitelist.indexOf(origin) !== -1 || !origin) {
	// 			callback(null, true)
	// 		} else {
	// 			callback(new Error('Not allowed by CORS'))
	// 		}
	// 	},
	// 	credentials: true,
	// }
	// router.get('/example',cors(corsOptions),(req,res,next)=>{
	// 	res.json({code:0});
	// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname,'../views/index.html'));
});

router.get('/example',(req,res,next)=>{
	res.json({code:0});
})
router.post('/example',(req,res,next)=>{
	let {type} = req.body;
	console.log(req.body)
	res.json(Object.assign({code:0},{
		type: type,
	}));
})

router.get('/account',(req,res,next)=>{
	let account = req.session.account||{type:-1};
	res.json({
		code: 0,
		account: account
	})
})
router.post('/account',(req,res,next)=>{
	const {type} = req.body;
	let account = {
		type: type||1,
	}
	req.session.account = account;
	res.json({
		code: 0,
		account: account,
	})
})
router.delete('/account',(req,res,next)=>{
	const {type} = req.body;
	req.session.account = null;
	res.json({
		code: 0,
	})
})

var resolveUploadPath = path=>{
	return process.env.host+':'+process.env.port +path.split('public')[1].replace(/\\/g,'/');
}


router.post('/avatar', upload.single('avatar'),(req,res,next)=>{
	res.json({
		code:0,
		filepath: resolveUploadPath(req.file.path),
	})
})
var uploadMethod = upload.array('avatar', 20)
router.post('/avatars',(req,res,next)=>{
	// use async method while handling errors
	uploadMethod(req,res,(err)=>{
		if(err){
			res.json({
				code: -1,
				errcode: err.code,
				message: err.message,
			})
		}else{
			res.json({
				code:0,
				filespath: req.files.map(value=>{
					let {fieldname,originalname,filename,path} = value;
					path = resolveUploadPath(path);
					return {fieldname,originalname,filename,path};
				})
			})
		}
	})
})

router.get('/redirect',(req,res,next)=>{
	const {type} = req.body;
	res.redirect(301,`/movies.json`);
})
router.post('/redirect',(req,res,next)=>{
	const {type} = req.body;
	res.redirect(301,`/movies.json`);
})



module.exports = router;
