/*
 * @Author: preciousmouse 
 * @Date: 2018-12-18 17:18:05 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-19 15:39:11
 */
import React from 'React'
import ReactDom from 'react-dom'
// import $ from 'jquery'

import './index.css'

export default class App extends React.Component{
    constructor(prop){
		super(prop);
		
		this.host = 'http://127.0.0.1:5010';
		this.exampleUrl = this.host+'/example';
		this.accountUrl = this.host+'/account';
		this.avatarUrl = this.host+'/avatar';
		this.avatarsUrl = this.host+'/avatars';
		this.redirectUrl = this.host+'/redirect';

	}

	componentDidMount(){
		document.querySelector("#file").onchange = (e)=>{
			this.fetchFile();
		}
		document.querySelector("#files").onchange = (e)=>{
			this.fetchFiles();
		}
		
	}
	
	postFetch = (url,data,params={},resolveFunc=null)=>{
		return fetch(url,Object.assign({
			body: JSON.stringify(data), // must match 'Content-Type' header
			cache: 'default', 	// *default, no-store, no-cache
								// reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, same-origin, *omit
			headers: {
				// 'User-Agent': 'haha',	//chrome中设置无效
				'Content-Type': 'application/json',
			},
			// headers: new Headers({//ie不支持 Headers
			// 	// 'User-Agent': 'haha',	//chrome中设置无效
			// 	'Content-Type': 'application/json',
			// }),
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			redirect: 'manual', // manual, *follow, error
			// referrer: 'x', // *当前url, client, no-referrer
			referrerPolicy: 'no-referrer-when-downgrade', 	//no-referrer 不发送referrer
								//*no-referrer-when-downgrade 转向不安全站点时不发送referrer
								//origin 只发送域名部分
								//origin-when-cross-origin 跨域时只发送origin
								//unsafe-url 发送完整url
			//integrity,
		},params)).then(res=>{
			if(typeof(resolveFunc)==="function"){//if(resolveFunc)
				return resolveFunc(res);
			}else if(res.ok){
				return res.json();
			}else{
				return res.text();
			}
		});
	}

	fetchJson = ()=>{
		fetch(this.host+'/movies.json',{
			cache: 'no-store', 	// *default 默认行为
								// no-store 完全绕过缓存
								// no-cache 每次请求向服务端验证缓存(无论缓存是否最新)
								// reload	请求阶段不使用缓存(?)
								// force-cache 如果有缓存，则强制使用(无论缓存是否过期)
								// only-if-cached 
		}).then((res)=>{
			return res.json();
		}).then((data)=>{
			console.log(0,data);
		})
	}

	fetchGet = ()=>{
		fetch(this.exampleUrl).then(res=>res.json()).then(data=>{
			console.log(1,data);
		})
	}
	fetchPostData = ()=>{
		this.postFetch(this.exampleUrl,{
			type:199
		}).then((data)=>{
			console.log(2,data);
		})
	}
	fetchCors = ()=>{
		this.postFetch(this.exampleUrl,{type:1},{
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'omit', // include, same-origin, *omit
								// 带凭据，  同源时带凭据，*不带凭据
								// 通过这个字段设置请求中是否带cookie
			mode: 'cors', // no-cors, cors, *same-origin
						// no-cors: 允许来自cdn、外域图片和其他跨域资源
						//			要求method只能为head/get/post	
						// cors: 用于跨域请求，遵循CORS协议，body可读
						//		部分header无法读取，在后端可进行权限设置
						//		(通过Access-Control-Expose-Headers等字段)
						// same-origin:	请求跨域时抛出error
		}).then(data=>{
			console.log(3,data);
		})
	}
	fetchLogin = ()=>{
		this.postFetch(this.accountUrl,{type:1},{
			credentials: 'include',
		}).then(data=>{
			console.log(4,data);
		})
	}
	fetchLogout = ()=>{
		fetch(this.accountUrl,{
			method: 'DELETE',
			credentials: 'include',
			mode: 'cors', // no-cors, cors, *same-origin
		}).then(res=>res.json()).then(data=>{
			console.log(5,data);
		})
	}
	fetchGetAccountStatus = ()=>{
		fetch(this.accountUrl,{
			credentials: 'include',
			mode: 'cors', // no-cors, cors, *same-origin
		}).then(res=>res.json()).then(data=>{
			console.log(6,data);
		})
	}

	fetchFile = ()=>{
		var formData = new FormData();
		formData.append('avatar',document.querySelector("#file").files[0]);
		this.postFetch(this.avatarUrl,{},{
			body: formData,
			headers: {
				// 'Content-Type': 'multipart/form-data',
			}
		}).then(data=>{
			console.log(7,data);
		})
	}
	fetchFiles = ()=>{
		var formData = new FormData();
		for(let file of Array.from(document.querySelector("#files").files)){
			formData.append('avatar',file);
		}
		this.postFetch(this.avatarsUrl,{},{
			body: formData,
			headers: {
				// 'Content-Type': 'multipart/form-data',
			}
		}).then(data=>{
			console.log(8,data);
		})
	}

	fetchRedirect = ()=>{
		this.postFetch(this.redirectUrl,{type:1},{
			redirect: 'follow', // manual, *follow, error
								//  手动模式，转发请求会发出但会被canceled(chrome)
								//			无法得到可用信息:type=opaqueredirect,redirect=false
								//			但可以通过该方法判断是否被重定向
								//	*默认自动转发 重定向请求不会触发resolve或reject，
								//				resolve得到转发后的response
								//  返回reject
		},res=>res).then(data=>{
			console.log(9,data);
		}).catch(err=>{
			console.log('err',err);
		})

		// fetch请求get与post表现一致
		// fetch(this.redirectUrl,{
		// 	redirect: 'follow', // manual, *follow, error
		// }).then(res=>res.json()).then(data=>{
		// 	console.log(data);
		// })
	}



    render(){
		return (
			<div className='demo'>
				<button onClick={this.fetchJson}>fetchJson</button>
				<button onClick={this.fetchGet}>fetchGet</button>
				<button onClick={this.fetchPostData}>fetchPostData</button>
				<button onClick={this.fetchCors}>fetchCors</button>
				<button onClick={this.fetchLogin}>fetchSession_login</button>
				<button onClick={this.fetchLogout}>fetchSession_logout</button>
				<button onClick={this.fetchGetAccountStatus}>
					fetchSession_accountStatus</button>
				<button onClick={()=>document.querySelector("#file").click()}>
					fetchFile</button>
					<input type="file" id='file' style={{display:'none'}}/>
				<button onClick={()=>document.querySelector("#files").click()}>
					fetchFiles</button>
					<input type="file" id='files' multiple style={{display:'none'}}/>
				<button onClick={this.fetchRedirect}>fetchRedirect</button>

			</div>
		)
    }
}

ReactDom.render(<App />,document.querySelector("#content"));