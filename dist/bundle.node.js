(()=>{"use strict";var e,r,t,o,n,a,i,s,u={607:(e,r,t)=>{t.a(e,(async e=>{t.r(r),t.d(r,{Random:()=>o.k,getLedger:()=>n});var o=t(963);const{getLedger:n}=await t.e(786).then(t.bind(t,786));e()}),1)},963:(e,r,t)=>{t.d(r,{k:()=>o});class o{static getBytes(e){return new Uint8Array(e)}}},747:e=>{e.exports=require("fs")},622:e=>{e.exports=require("path")}},f={};function c(e){var r=f[e];if(void 0!==r)return r.exports;var t=f[e]={id:e,loaded:!1,exports:{}};return u[e](t,t.exports,c),t.loaded=!0,t.exports}c.m=u,e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",r="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},o=e=>!--e.r&&e(),n=(e,r)=>e?e.push(r):o(r),c.a=(a,i,s)=>{var u,f,c,p=s&&[],d=a.exports,l=!0,y=!1,b=(r,t,o)=>{y||(y=!0,t.r+=r.length,r.map(((r,n)=>r[e](t,o))),y=!1)},h=new Promise(((e,r)=>{c=r,f=()=>(e(d),t(p),p=0)}));h[r]=d,h[e]=(e,r)=>{if(l)return o(e);u&&b(u,e,r),n(p,e),h.catch(r)},a.exports=h,i((a=>{if(!a)return f();var i,s;u=(a=>a.map((a=>{if(null!==a&&"object"==typeof a){if(a[e])return a;if(a.then){var i=[];a.then((e=>{s[r]=e,t(i),i=0}));var s={[e]:(e,r)=>(n(i,e),a.catch(r))};return s}}return{[e]:e=>o(e),[r]:a}})))(a);var c=new Promise(((e,t)=>{(i=()=>e(s=u.map((e=>e[r])))).r=0,b(u,i,t)}));return i.r?c:s})).then(f,c),l=!1},i=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,c.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var t=Object.create(null);c.r(t);var o={};a=a||[null,i({}),i([]),i(i)];for(var n=2&r&&e;"object"==typeof n&&!~a.indexOf(n);n=i(n))Object.getOwnPropertyNames(n).forEach((r=>o[r]=()=>e[r]));return o.default=()=>e,c.d(t,o),t},c.d=(e,r)=>{for(var t in r)c.o(r,t)&&!c.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},c.f={},c.e=e=>Promise.all(Object.keys(c.f).reduce(((r,t)=>(c.f[t](e,r),r)),[])),c.u=e=>e+".bundle.node.js",c.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),c.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),c.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),c.p="",s={179:1},c.f.require=(e,r)=>{s[e]||(e=>{var r=e.modules,t=e.ids,o=e.runtime;for(var n in r)c.o(r,n)&&(c.m[n]=r[n]);o&&o(c);for(var a=0;a<t.length;a++)s[t[a]]=1})(require("./"+c.u(e)))},c.v=(e,r,t,o)=>new Promise((function(e,r){var{readFile:o}=require("fs"),{join:n}=require("path");try{o(n(__dirname,t+".module.wasm"),(function(t,o){if(t)return r(t);e({arrayBuffer:()=>o})}))}catch(e){r(e)}})).then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,o))).then((r=>Object.assign(e,r.instance.exports)));var p=c(607),d=exports;for(var l in p)d[l]=p[l];p.__esModule&&Object.defineProperty(d,"__esModule",{value:!0})})();
//# sourceMappingURL=bundle.node.js.map