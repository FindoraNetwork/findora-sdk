exports.id=547,exports.ids=[547],exports.modules={547:(r,t,e)=>{"use strict";e.a(r,(async r=>{e.r(t),e.d(t,{AssetRules:()=>_.RA,AssetTracerKeyPair:()=>_.sK,AssetType:()=>_.h3,AuthenticatedAIRResult:()=>_.S_,AuthenticatedAssetRecord:()=>_.gh,BipPath:()=>_.I,ClientAssetRecord:()=>_.Hr,CredIssuerPublicKey:()=>_.gP,CredIssuerSecretKey:()=>_.zi,CredUserPublicKey:()=>_.vG,CredUserSecretKey:()=>_.rD,Credential:()=>_.hJ,CredentialCommitment:()=>_.pB,CredentialCommitmentData:()=>_.SR,CredentialCommitmentKey:()=>_.cC,CredentialIssuerKeyPair:()=>_.Mo,CredentialPoK:()=>_.pw,CredentialRevealSig:()=>_.P2,CredentialSignature:()=>_.cy,CredentialUserKeyPair:()=>_.jN,FeeInputs:()=>_.oZ,KVBlind:()=>_.YW,KVHash:()=>_.ym,Key:()=>_.sr,OwnerMemo:()=>_.MX,PublicParams:()=>_.sx,SignatureRules:()=>_.Vf,TracingPolicies:()=>_.gi,TracingPolicy:()=>_.h$,TransactionBuilder:()=>_.hK,TransferOperationBuilder:()=>_.le,TxoRef:()=>_.R5,XfrKeyPair:()=>_.U0,XfrPublicKey:()=>_.qp,__wbg_buffer_eb5185aa4a8e9c62:()=>_.ig,__wbg_crypto_b8c92eaac23d0d80:()=>_.iY,__wbg_crypto_bfb05100db79193b:()=>_._y,__wbg_getRandomValues_57e4008f45f0e105:()=>_.E_,__wbg_getRandomValues_dd27e6b0652b3236:()=>_.yX,__wbg_getRandomValues_e57c9b75ddead065:()=>_.ae,__wbg_length_2e324c9c0e74a81d:()=>_.Be,__wbg_msCrypto_9ad6677321a08dd8:()=>_.mS,__wbg_msCrypto_f6dddc6ae048b7e2:()=>_.Yj,__wbg_new_3d94e83f0a6bf252:()=>_.Ls,__wbg_newwithlength_02a009c0728d3ba1:()=>_.IS,__wbg_randomFillSync_d2ba53160aec6aba:()=>_.Os,__wbg_randomFillSync_d90848a552cbd666:()=>_.L7,__wbg_require_c59851dfa0dc7e78:()=>_.sV,__wbg_require_f5521a5b85ad2542:()=>_.r2,__wbg_self_86b4b13392c7af56:()=>_.U5,__wbg_self_f865985e662246aa:()=>_.MY,__wbg_set_d4d7629a896d4b3e:()=>_.$$,__wbg_static_accessor_MODULE_39947eb3fe77895f:()=>_.f$,__wbg_static_accessor_MODULE_452b4680e8614c81:()=>_.DA,__wbg_subarray_cc54babc55409ee0:()=>_.sP,__wbindgen_debug_string:()=>_.fY,__wbindgen_is_undefined:()=>_.XP,__wbindgen_json_parse:()=>_.t$,__wbindgen_json_serialize:()=>_.r1,__wbindgen_memory:()=>_.oH,__wbindgen_object_drop_ref:()=>_.ug,__wbindgen_rethrow:()=>_.nD,__wbindgen_string_new:()=>_.h4,__wbindgen_throw:()=>_.Or,asset_type_from_jsvalue:()=>_.Yy,base64_to_bech32:()=>_.yA,bech32_to_base64:()=>_.Ej,build_id:()=>_.zq,calculate_fee:()=>_.ON,create_credential:()=>_.Py,create_debt_memo:()=>_.YJ,create_debt_policy_info:()=>_.sc,create_default_policy_info:()=>_.H$,create_keypair_from_secret:()=>_.Yw,decryption_pbkdf2_aes256gcm:()=>_.yi,encryption_pbkdf2_aes256gcm:()=>_.Gh,fra_get_asset_code:()=>_.zx,fra_get_dest_pubkey:()=>_.rc,fra_get_minimal_fee:()=>_.Od,generate_mnemonic_custom:()=>_.A1,generate_mnemonic_default:()=>_.GQ,get_null_pk:()=>_.Lt,get_pk_from_keypair:()=>_.Pp,get_priv_key_str:()=>_.or,get_pub_key_str:()=>_.dI,keypair_from_str:()=>_.s3,keypair_to_str:()=>_.h1,new_keypair:()=>_.sM,new_keypair_from_seed:()=>_.x7,open_client_asset_record:()=>_.U6,public_key_from_base64:()=>_.CA,public_key_from_bech32:()=>_.oE,public_key_to_base64:()=>_.Mt,public_key_to_bech32:()=>_.Hu,random_asset_type:()=>_.JS,restore_keypair_from_mnemonic_bip44:()=>_.ap,restore_keypair_from_mnemonic_bip49:()=>_.qN,restore_keypair_from_mnemonic_default:()=>_.xp,trace_assets:()=>_.HO,verify_authenticated_custom_data_result:()=>_.X3,verify_authenticated_txn:()=>_.YH,wasm_credential_commit:()=>_.fx,wasm_credential_issuer_key_gen:()=>_.Ec,wasm_credential_open_commitment:()=>_.Q0,wasm_credential_reveal:()=>_.a3,wasm_credential_sign:()=>_.Tn,wasm_credential_user_key_gen:()=>_.OD,wasm_credential_verify:()=>_.gL,wasm_credential_verify_commitment:()=>_.ms});var _=e(703),n=r([_]);_=(n.then?await n:n)[0]}))},703:(r,t,e)=>{"use strict";e.a(r,(async _=>{e.d(t,{zq:()=>S,JS:()=>C,Yy:()=>P,YH:()=>$,X3:()=>R,ON:()=>Y,Lt:()=>E,H$:()=>U,sc:()=>D,YJ:()=>K,U6:()=>I,dI:()=>T,or:()=>q,sM:()=>H,x7:()=>L,Mt:()=>X,CA:()=>B,h1:()=>F,s3:()=>J,Ec:()=>N,ms:()=>z,Q0:()=>G,OD:()=>Q,Tn:()=>W,Py:()=>Z,fx:()=>rr,a3:()=>tr,gL:()=>er,HO:()=>_r,Hu:()=>nr,oE:()=>ar,Ej:()=>ir,yA:()=>sr,Gh:()=>or,yi:()=>pr,Yw:()=>lr,Pp:()=>ur,GQ:()=>dr,A1:()=>fr,xp:()=>br,ap:()=>wr,qN:()=>gr,zx:()=>yr,Od:()=>mr,rc:()=>hr,RA:()=>kr,sK:()=>jr,h3:()=>Or,S_:()=>xr,gh:()=>Ar,I:()=>Sr,Hr:()=>Cr,gP:()=>Pr,zi:()=>$r,vG:()=>Rr,rD:()=>Yr,hJ:()=>Er,pB:()=>Ur,SR:()=>Dr,cC:()=>Kr,Mo:()=>Mr,pw:()=>Vr,P2:()=>Ir,cy:()=>Tr,jN:()=>qr,oZ:()=>Hr,YW:()=>Lr,ym:()=>Xr,sr:()=>Br,MX:()=>Fr,sx:()=>Jr,Vf:()=>Nr,gi:()=>zr,h$:()=>Gr,hK:()=>Qr,le:()=>Wr,R5:()=>Zr,U0:()=>rt,qp:()=>tt,ug:()=>et,r1:()=>_t,h4:()=>nt,t$:()=>at,E_:()=>it,L7:()=>st,MY:()=>ct,f$:()=>ot,sV:()=>pt,_y:()=>lt,Yj:()=>ut,XP:()=>dt,U5:()=>ft,DA:()=>bt,r2:()=>wt,iY:()=>gt,mS:()=>yt,yX:()=>mt,ae:()=>ht,Os:()=>vt,ig:()=>kt,Be:()=>jt,Ls:()=>Ot,$$:()=>xt,IS:()=>At,sP:()=>St,fY:()=>Ct,Or:()=>Pt,nD:()=>$t,oH:()=>Rt});var n=e(801);r=e.hmd(r);var a=_([n]);n=(a.then?await a:a)[0];const i=new Array(32).fill(void 0);function s(r){return i[r]}i.push(void 0,null,!0,!1);let c=i.length;function o(r){const t=s(r);return function(r){r<36||(i[r]=c,c=r)}(r),t}let p=0,l=null;function u(){return null!==l&&l.buffer===n.memory.buffer||(l=new Uint8Array(n.memory.buffer)),l}let d=new("undefined"==typeof TextEncoder?(0,r.require)("util").TextEncoder:TextEncoder)("utf-8");const f="function"==typeof d.encodeInto?function(r,t){return d.encodeInto(r,t)}:function(r,t){const e=d.encode(r);return t.set(e),{read:r.length,written:e.length}};function b(r,t,e){if(void 0===e){const e=d.encode(r),_=t(e.length);return u().subarray(_,_+e.length).set(e),p=e.length,_}let _=r.length,n=t(_);const a=u();let i=0;for(;i<_;i++){const t=r.charCodeAt(i);if(t>127)break;a[n+i]=t}if(i!==_){0!==i&&(r=r.slice(i)),n=e(n,_,_=i+3*r.length);const t=u().subarray(n+i,n+_);i+=f(r,t).written}return p=i,n}let w=null;function g(){return null!==w&&w.buffer===n.memory.buffer||(w=new Int32Array(n.memory.buffer)),w}let y=new("undefined"==typeof TextDecoder?(0,r.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function m(r,t){return y.decode(u().subarray(r,r+t))}function h(r){c===i.length&&i.push(i.length+1);const t=c;return c=i[t],i[t]=r,t}function v(r){const t=typeof r;if("number"==t||"boolean"==t||null==r)return`${r}`;if("string"==t)return`"${r}"`;if("symbol"==t){const t=r.description;return null==t?"Symbol":`Symbol(${t})`}if("function"==t){const t=r.name;return"string"==typeof t&&t.length>0?`Function(${t})`:"Function"}if(Array.isArray(r)){const t=r.length;let e="[";t>0&&(e+=v(r[0]));for(let _=1;_<t;_++)e+=", "+v(r[_]);return e+="]",e}const e=/\[object ([^\]]+)\]/.exec(toString.call(r));let _;if(!(e.length>1))return toString.call(r);if(_=e[1],"Object"==_)try{return"Object("+JSON.stringify(r)+")"}catch(r){return"Object"}return r instanceof Error?`${r.name}: ${r.message}\n${r.stack}`:_}y.decode();const k=new Uint32Array(2),j=new BigUint64Array(k.buffer);let O=32;function x(r){if(1==O)throw new Error("out of js stack");return i[--O]=r,O}function A(r,t){if(!(r instanceof t))throw new Error(`expected instance of ${t.name}`);return r.ptr}function S(){try{n.build_id(8);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}function C(){try{n.random_asset_type(8);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}function P(r){try{n.asset_type_from_jsvalue(8,x(r));var t=g()[2],e=g()[3];return m(t,e)}finally{i[O++]=void 0,n.__wbindgen_free(t,e)}}function $(r,t){var e=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p,a=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p;return 0!==n.verify_authenticated_txn(e,_,a,i)}function R(r,t){var e=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p;return 0!==n.verify_authenticated_custom_data_result(e,_,h(t))}function Y(r,t,e){j[0]=r;const _=k[0],a=k[1];j[0]=t;const i=k[0],s=k[1];j[0]=e;const c=k[0],o=k[1];n.calculate_fee(8,_,a,i,s,c,o);var p=g()[2],l=g()[3];return k[0]=p,k[1]=l,j[0]}function E(){var r=n.get_null_pk();return tt.__wrap(r)}function U(){try{n.create_default_policy_info(8);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}function D(r,t,e,_){try{j[0]=r;const o=k[0],l=k[1];j[0]=t;const u=k[0],d=k[1];var a=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p;j[0]=_;const f=k[0],w=k[1];n.create_debt_policy_info(8,o,l,u,d,a,i,f,w);var s=g()[2],c=g()[3];return m(s,c)}finally{n.__wbindgen_free(s,c)}}function K(r,t,e,_){try{j[0]=r;const o=k[0],l=k[1];j[0]=t;const u=k[0],d=k[1];var a=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p;j[0]=_;const f=k[0],w=k[1];n.create_debt_memo(8,o,l,u,d,a,i,f,w);var s=g()[2],c=g()[3];return m(s,c)}finally{n.__wbindgen_free(s,c)}}function M(r){return null==r}let V=null;function I(r,t,e){A(r,Cr);let _=0;return M(t)||(A(t,Fr),_=t.ptr,t.ptr=0),A(e,rt),o(n.open_client_asset_record(r.ptr,_,e.ptr))}function T(r){try{A(r,rt),n.get_pub_key_str(8,r.ptr);var t=g()[2],e=g()[3];return m(t,e)}finally{n.__wbindgen_free(t,e)}}function q(r){try{A(r,rt),n.get_priv_key_str(8,r.ptr);var t=g()[2],e=g()[3];return m(t,e)}finally{n.__wbindgen_free(t,e)}}function H(){var r=n.new_keypair();return rt.__wrap(r)}function L(r,t){var e=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p,a=M(t)?0:b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p,s=n.new_keypair_from_seed(e,_,a,i);return rt.__wrap(s)}function X(r){try{A(r,tt),n.public_key_to_base64(8,r.ptr);var t=g()[2],e=g()[3];return m(t,e)}finally{n.__wbindgen_free(t,e)}}function B(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.public_key_from_base64(t,e);return tt.__wrap(_)}function F(r){try{A(r,rt),n.keypair_to_str(8,r.ptr);var t=g()[2],e=g()[3];return m(t,e)}finally{n.__wbindgen_free(t,e)}}function J(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.keypair_from_str(t,e);return rt.__wrap(_)}function N(r){var t=n.wasm_credential_issuer_key_gen(h(r));return Mr.__wrap(t)}function z(r,t,e,_){A(r,Pr),A(t,Ur),A(e,Vr),A(_,tt),n.wasm_credential_verify_commitment(r.ptr,t.ptr,e.ptr,_.ptr)}function G(r,t,e,_){A(r,Yr),A(t,Er),A(e,Kr);var a=n.wasm_credential_open_commitment(r.ptr,t.ptr,e.ptr,h(_));return Vr.__wrap(a)}function Q(r){A(r,Pr);var t=n.wasm_credential_user_key_gen(r.ptr);return qr.__wrap(t)}function W(r,t,e){A(r,$r),A(t,Rr);var _=n.wasm_credential_sign(r.ptr,t.ptr,h(e));return Tr.__wrap(_)}function Z(r,t,e){try{A(r,Pr),A(t,Tr);var _=n.create_credential(r.ptr,t.ptr,x(e));return Er.__wrap(_)}finally{i[O++]=void 0}}function rr(r,t,e){A(r,Yr),A(t,tt),A(e,Er);var _=n.wasm_credential_commit(r.ptr,t.ptr,e.ptr);return Dr.__wrap(_)}function tr(r,t,e){A(r,Yr),A(t,Er);var _=n.wasm_credential_reveal(r.ptr,t.ptr,h(e));return Ir.__wrap(_)}function er(r,t,e,_){A(r,Pr),A(e,Ur),A(_,Vr),n.wasm_credential_verify(r.ptr,h(t),e.ptr,_.ptr)}function _r(r,t,e){return A(t,jr),o(n.trace_assets(h(r),t.ptr,h(e)))}function nr(r){try{A(r,tt),n.public_key_to_bech32(8,r.ptr);var t=g()[2],e=g()[3];return m(t,e)}finally{n.__wbindgen_free(t,e)}}function ar(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.public_key_from_bech32(t,e);return tt.__wrap(_)}function ir(r){try{var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p;n.bech32_to_base64(8,t,e);var _=g()[2],a=g()[3];return m(_,a)}finally{n.__wbindgen_free(_,a)}}function sr(r){try{var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p;n.base64_to_bech32(8,t,e);var _=g()[2],a=g()[3];return m(_,a)}finally{n.__wbindgen_free(_,a)}}function cr(r,t){return u().subarray(r/1,r/1+t)}function or(r,t){var e=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p,a=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p;n.encryption_pbkdf2_aes256gcm(8,e,_,a,i);var s=g()[2],c=g()[3],o=cr(s,c).slice();return n.__wbindgen_free(s,1*c),o}function pr(r,t){try{var e=function(r,t){const e=t(1*r.length);return u().set(r,e/1),p=r.length,e}(r,n.__wbindgen_malloc),_=p,a=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p;n.decryption_pbkdf2_aes256gcm(8,e,_,a,i);var s=g()[2],c=g()[3];return m(s,c)}finally{n.__wbindgen_free(s,c)}}function lr(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.create_keypair_from_secret(t,e);return 0===_?void 0:rt.__wrap(_)}function ur(r){A(r,rt);var t=n.get_pk_from_keypair(r.ptr);return tt.__wrap(t)}function dr(){try{n.generate_mnemonic_default(8);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}function fr(r,t){try{var e=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p;n.generate_mnemonic_custom(8,r,e,_);var a=g()[2],i=g()[3];return m(a,i)}finally{n.__wbindgen_free(a,i)}}function br(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.restore_keypair_from_mnemonic_default(t,e);return rt.__wrap(_)}function wr(r,t,e){var _=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),a=p,i=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),s=p;A(e,Sr);var c=n.restore_keypair_from_mnemonic_bip44(_,a,i,s,e.ptr);return rt.__wrap(c)}function gr(r,t,e){var _=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),a=p,i=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),s=p;A(e,Sr);var c=n.restore_keypair_from_mnemonic_bip49(_,a,i,s,e.ptr);return rt.__wrap(c)}function yr(){try{n.fra_get_asset_code(8);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}function mr(){n.fra_get_minimal_fee(8);var r=g()[2],t=g()[3];return k[0]=r,k[1]=t,j[0]}function hr(){var r=n.fra_get_dest_pubkey();return tt.__wrap(r)}function vr(r){return function(){try{return r.apply(this,arguments)}catch(r){n.__wbindgen_exn_store(h(r))}}}class kr{static __wrap(r){const t=Object.create(kr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_assetrules_free(r)}static new(){var r=n.assetrules_new();return kr.__wrap(r)}add_tracing_policy(r){var t=this.ptr;this.ptr=0,A(r,Gr);var e=n.assetrules_add_tracing_policy(t,r.ptr);return kr.__wrap(e)}set_max_units(r){var t=this.ptr;this.ptr=0,j[0]=r;const e=k[0],_=k[1];var a=n.assetrules_set_max_units(t,e,_);return kr.__wrap(a)}set_transferable(r){var t=this.ptr;this.ptr=0;var e=n.assetrules_set_transferable(t,r);return kr.__wrap(e)}set_updatable(r){var t=this.ptr;this.ptr=0;var e=n.assetrules_set_updatable(t,r);return kr.__wrap(e)}set_transfer_multisig_rules(r){var t=this.ptr;this.ptr=0,A(r,Nr);var e=r.ptr;r.ptr=0;var _=n.assetrules_set_transfer_multisig_rules(t,e);return kr.__wrap(_)}set_decimals(r){var t=this.ptr;this.ptr=0;var e=n.assetrules_set_decimals(t,r);return kr.__wrap(e)}}class jr{static __wrap(r){const t=Object.create(jr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_assettracerkeypair_free(r)}static new(){var r=n.assettracerkeypair_new();return jr.__wrap(r)}}class Or{static __wrap(r){const t=Object.create(Or.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_assettype_free(r)}static from_json(r){try{var t=n.assettype_from_json(x(r));return Or.__wrap(t)}finally{i[O++]=void 0}}get_tracing_policies(){var r=n.assettype_get_tracing_policies(this.ptr);return zr.__wrap(r)}}class xr{static __wrap(r){const t=Object.create(xr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_authenticatedairresult_free(r)}static from_json(r){try{var t=n.authenticatedairresult_from_json(x(r));return xr.__wrap(t)}finally{i[O++]=void 0}}is_valid(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p;return 0!==n.authenticatedairresult_is_valid(this.ptr,t,e)}get_commitment(){var r=n.authenticatedairresult_get_commitment(this.ptr);return 0===r?void 0:Ur.__wrap(r)}}class Ar{static __wrap(r){const t=Object.create(Ar.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_authenticatedassetrecord_free(r)}is_valid(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p;return 0!==n.authenticatedassetrecord_is_valid(this.ptr,t,e)}static from_json_record(r){try{var t=n.authenticatedassetrecord_from_json_record(x(r));return Ar.__wrap(t)}finally{i[O++]=void 0}}}class Sr{static __wrap(r){const t=Object.create(Sr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_bippath_free(r)}static new(r,t,e,_){var a=n.bippath_new(r,t,e,_);return Sr.__wrap(a)}}class Cr{static __wrap(r){const t=Object.create(Cr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_clientassetrecord_free(r)}static from_json(r){try{var t=n.clientassetrecord_from_json(x(r));return Cr.__wrap(t)}finally{i[O++]=void 0}}to_json(){return o(n.clientassetrecord_to_json(this.ptr))}}class Pr{static __wrap(r){const t=Object.create(Pr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credissuerpublickey_free(r)}}class $r{static __wrap(r){const t=Object.create($r.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credissuersecretkey_free(r)}}class Rr{static __wrap(r){const t=Object.create(Rr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_creduserpublickey_free(r)}}class Yr{static __wrap(r){const t=Object.create(Yr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credusersecretkey_free(r)}}class Er{static __wrap(r){const t=Object.create(Er.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credential_free(r)}}class Ur{static __wrap(r){const t=Object.create(Ur.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialcommitment_free(r)}}class Dr{static __wrap(r){const t=Object.create(Dr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialcommitmentdata_free(r)}get_commitment(){var r=n.credentialcommitmentdata_get_commitment(this.ptr);return Ur.__wrap(r)}get_pok(){var r=n.credentialcommitmentdata_get_pok(this.ptr);return Vr.__wrap(r)}get_commit_key(){var r=n.credentialcommitmentdata_get_commit_key(this.ptr);return Kr.__wrap(r)}}class Kr{static __wrap(r){const t=Object.create(Kr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialcommitmentkey_free(r)}}class Mr{static __wrap(r){const t=Object.create(Mr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialissuerkeypair_free(r)}get_pk(){var r=n.credentialissuerkeypair_get_pk(this.ptr);return Pr.__wrap(r)}get_sk(){var r=n.credentialissuerkeypair_get_sk(this.ptr);return $r.__wrap(r)}to_json(){return o(n.credentialissuerkeypair_to_json(this.ptr))}static from_json(r){try{var t=n.credentialissuerkeypair_from_json(x(r));return Mr.__wrap(t)}finally{i[O++]=void 0}}}class Vr{static __wrap(r){const t=Object.create(Vr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialpok_free(r)}}class Ir{static __wrap(r){const t=Object.create(Ir.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialrevealsig_free(r)}get_commitment(){var r=n.credentialcommitmentdata_get_commitment(this.ptr);return Ur.__wrap(r)}get_pok(){var r=n.credentialrevealsig_get_pok(this.ptr);return Vr.__wrap(r)}}class Tr{static __wrap(r){const t=Object.create(Tr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialsignature_free(r)}}class qr{static __wrap(r){const t=Object.create(qr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_credentialuserkeypair_free(r)}get_pk(){var r=n.credentialuserkeypair_get_pk(this.ptr);return Rr.__wrap(r)}get_sk(){var r=n.credentialuserkeypair_get_sk(this.ptr);return Yr.__wrap(r)}to_json(){return o(n.credentialuserkeypair_to_json(this.ptr))}static from_json(r){try{var t=n.credentialuserkeypair_from_json(x(r));return qr.__wrap(t)}finally{i[O++]=void 0}}}class Hr{static __wrap(r){const t=Object.create(Hr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_feeinputs_free(r)}static new(){var r=n.feeinputs_new();return Hr.__wrap(r)}append(r,t,e,_,a){j[0]=r;const i=k[0],s=k[1];A(t,Zr);var c=t.ptr;t.ptr=0,A(e,Cr);var o=e.ptr;e.ptr=0;let p=0;M(_)||(A(_,Fr),p=_.ptr,_.ptr=0),A(a,rt);var l=a.ptr;a.ptr=0,n.feeinputs_append(this.ptr,i,s,c,o,p,l)}append2(r,t,e,_,a){var i=this.ptr;this.ptr=0,j[0]=r;const s=k[0],c=k[1];A(t,Zr);var o=t.ptr;t.ptr=0,A(e,Cr);var p=e.ptr;e.ptr=0;let l=0;M(_)||(A(_,Fr),l=_.ptr,_.ptr=0),A(a,rt);var u=a.ptr;a.ptr=0;var d=n.feeinputs_append2(i,s,c,o,p,l,u);return Hr.__wrap(d)}}class Lr{static __wrap(r){const t=Object.create(Lr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_kvblind_free(r)}static gen_random(){var r=n.kvblind_gen_random();return Lr.__wrap(r)}to_json(){return o(n.kvblind_to_json(this.ptr))}static from_json(r){try{var t=n.kvblind_from_json(x(r));return Lr.__wrap(t)}finally{i[O++]=void 0}}}class Xr{static __wrap(r){const t=Object.create(Xr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_kvhash_free(r)}static new_no_blind(r){try{var t=n.kvhash_new_no_blind(x(r));return Xr.__wrap(t)}finally{i[O++]=void 0}}static new_with_blind(r,t){try{A(t,Lr);var e=n.kvhash_new_with_blind(x(r),t.ptr);return Xr.__wrap(e)}finally{i[O++]=void 0}}}class Br{static __wrap(r){const t=Object.create(Br.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_key_free(r)}static gen_random(){var r=n.key_gen_random();return Br.__wrap(r)}to_base64(){try{n.key_to_base64(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}static from_base64(r){var t=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),e=p,_=n.key_from_base64(t,e);return Br.__wrap(_)}}class Fr{static __wrap(r){const t=Object.create(Fr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_ownermemo_free(r)}static from_json(r){try{var t=n.ownermemo_from_json(x(r));return Fr.__wrap(t)}finally{i[O++]=void 0}}clone(){var r=n.ownermemo_clone(this.ptr);return Fr.__wrap(r)}}class Jr{static __wrap(r){const t=Object.create(Jr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_publicparams_free(r)}static new(){var r=n.publicparams_new();return Jr.__wrap(r)}}class Nr{static __wrap(r){const t=Object.create(Nr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_signaturerules_free(r)}static new(r,t){j[0]=r;const e=k[0],_=k[1];var a=n.signaturerules_new(e,_,h(t));return Nr.__wrap(a)}}class zr{static __wrap(r){const t=Object.create(zr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_tracingpolicies_free(r)}}class Gr{static __wrap(r){const t=Object.create(Gr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_tracingpolicy_free(r)}static new_with_tracing(r){A(r,jr);var t=n.tracingpolicy_new_with_tracing(r.ptr);return Gr.__wrap(t)}static new_with_identity_tracing(r,t,e,_){A(r,jr),A(t,Pr);var a=n.tracingpolicy_new_with_identity_tracing(r.ptr,t.ptr,h(e),_);return Gr.__wrap(a)}}class Qr{static __wrap(r){const t=Object.create(Qr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_transactionbuilder_free(r)}add_fee_relative_auto(r,t){var e=this.ptr;this.ptr=0,j[0]=r;const _=k[0],a=k[1];A(t,rt);var i=t.ptr;t.ptr=0;var s=n.transactionbuilder_add_fee_relative_auto(e,_,a,i);return Qr.__wrap(s)}get_relative_outputs(){n.transactionbuilder_get_relative_outputs(8,this.ptr);var r=g()[2],t=g()[3],e=function(r,t){const e=(null!==V&&V.buffer===n.memory.buffer||(V=new Uint32Array(n.memory.buffer)),V).subarray(r/4,r/4+t),_=[];for(let r=0;r<e.length;r++)_.push(o(e[r]));return _}(r,t).slice();return n.__wbindgen_free(r,4*t),e}add_fee(r){var t=this.ptr;this.ptr=0,A(r,Hr);var e=r.ptr;r.ptr=0;var _=n.transactionbuilder_add_fee(t,e);return Qr.__wrap(_)}check_fee(){return 0!==n.transactionbuilder_check_fee(this.ptr)}static new(r){j[0]=r;const t=k[0],e=k[1];var _=n.transactionbuilder_new(t,e);return Qr.__wrap(_)}add_operation_create_asset(r,t,e,_){var a=this.ptr;this.ptr=0,A(r,rt);var i=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),s=p,c=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),o=p;A(_,kr);var l=_.ptr;_.ptr=0;var u=n.transactionbuilder_add_operation_create_asset(a,r.ptr,i,s,c,o,l);return Qr.__wrap(u)}add_operation_create_asset_with_policy(r,t,e,_,a){var i=this.ptr;this.ptr=0,A(r,rt);var s=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),c=p,o=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),l=p,u=b(_,n.__wbindgen_malloc,n.__wbindgen_realloc),d=p;A(a,kr);var f=a.ptr;a.ptr=0;var w=n.transactionbuilder_add_operation_create_asset_with_policy(i,r.ptr,s,c,o,l,u,d,f);return Qr.__wrap(w)}add_policy_option(r,t){var e=this.ptr;this.ptr=0;var _=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),a=p,i=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),s=p,c=n.transactionbuilder_add_policy_option(e,_,a,i,s);return Qr.__wrap(c)}add_basic_issue_asset(r,t,e,_,a,i){var s=this.ptr;this.ptr=0,A(r,rt);var c=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),o=p;j[0]=e;const l=k[0],u=k[1];j[0]=_;const d=k[0],f=k[1];A(i,Jr);var w=n.transactionbuilder_add_basic_issue_asset(s,r.ptr,c,o,l,u,d,f,a,i.ptr);return Qr.__wrap(w)}add_operation_air_assign(r,t,e,_,a){var i=this.ptr;this.ptr=0,A(r,rt),A(t,Rr),A(e,Pr),A(_,Ur),A(a,Vr);var s=n.transactionbuilder_add_operation_air_assign(i,r.ptr,t.ptr,e.ptr,_.ptr,a.ptr);return Qr.__wrap(s)}add_operation_kv_update_no_hash(r,t,e){var _=this.ptr;this.ptr=0,A(r,rt),A(t,Br),j[0]=e;const a=k[0],i=k[1];var s=n.transactionbuilder_add_operation_kv_update_no_hash(_,r.ptr,t.ptr,a,i);return Qr.__wrap(s)}add_operation_kv_update_with_hash(r,t,e,_){var a=this.ptr;this.ptr=0,A(r,rt),A(t,Br),j[0]=e;const i=k[0],s=k[1];A(_,Xr);var c=n.transactionbuilder_add_operation_kv_update_with_hash(a,r.ptr,t.ptr,i,s,_.ptr);return Qr.__wrap(c)}add_operation_update_memo(r,t,e){var _=this.ptr;this.ptr=0,A(r,rt);var a=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),i=p,s=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),c=p,o=n.transactionbuilder_add_operation_update_memo(_,r.ptr,a,i,s,c);return Qr.__wrap(o)}add_transfer_operation(r){var t=this.ptr;this.ptr=0;var e=b(r,n.__wbindgen_malloc,n.__wbindgen_realloc),_=p,a=n.transactionbuilder_add_transfer_operation(t,e,_);return Qr.__wrap(a)}sign(r){var t=this.ptr;this.ptr=0,A(r,rt);var e=n.transactionbuilder_sign(t,r.ptr);return Qr.__wrap(e)}transaction(){try{n.transactionbuilder_transaction(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}transaction_handle(){try{n.transactionbuilder_transaction_handle(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}get_owner_record(r){var t=n.transactionbuilder_get_owner_record(this.ptr,r);return Cr.__wrap(t)}get_owner_memo(r){var t=n.transactionbuilder_get_owner_memo(this.ptr,r);return 0===t?void 0:Fr.__wrap(t)}}class Wr{static __wrap(r){const t=Object.create(Wr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_transferoperationbuilder_free(r)}static new(){var r=n.transferoperationbuilder_new();return Wr.__wrap(r)}debug(){try{n.transferoperationbuilder_debug(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}add_input_with_tracing(r,t,e,_,a,i){var s=this.ptr;this.ptr=0,A(r,Zr);var c=r.ptr;r.ptr=0,A(t,Cr);var o=t.ptr;t.ptr=0;let p=0;M(e)||(A(e,Fr),p=e.ptr,e.ptr=0),A(_,zr),A(a,rt),j[0]=i;const l=k[0],u=k[1];var d=n.transferoperationbuilder_add_input_with_tracing(s,c,o,p,_.ptr,a.ptr,l,u);return Wr.__wrap(d)}add_input_no_tracing(r,t,e,_,a){var i=this.ptr;this.ptr=0,A(r,Zr);var s=r.ptr;r.ptr=0,A(t,Cr);let c=0;M(e)||(A(e,Fr),c=e.ptr,e.ptr=0),A(_,rt),j[0]=a;const o=k[0],p=k[1];var l=n.transferoperationbuilder_add_input_no_tracing(i,s,t.ptr,c,_.ptr,o,p);return Wr.__wrap(l)}add_output_with_tracing(r,t,e,_,a,i){var s=this.ptr;this.ptr=0,j[0]=r;const c=k[0],o=k[1];A(t,tt),A(e,zr);var l=b(_,n.__wbindgen_malloc,n.__wbindgen_realloc),u=p,d=n.transferoperationbuilder_add_output_with_tracing(s,c,o,t.ptr,e.ptr,l,u,a,i);return Wr.__wrap(d)}add_output_no_tracing(r,t,e,_,a){var i=this.ptr;this.ptr=0,j[0]=r;const s=k[0],c=k[1];A(t,tt);var o=b(e,n.__wbindgen_malloc,n.__wbindgen_realloc),l=p,u=n.transferoperationbuilder_add_output_no_tracing(i,s,c,t.ptr,o,l,_,a);return Wr.__wrap(u)}balance(){var r=this.ptr;this.ptr=0;var t=n.transferoperationbuilder_balance(r);return Wr.__wrap(t)}create(){var r=this.ptr;this.ptr=0;var t=n.transferoperationbuilder_create(r);return Wr.__wrap(t)}sign(r){var t=this.ptr;this.ptr=0,A(r,rt);var e=n.transferoperationbuilder_sign(t,r.ptr);return Wr.__wrap(e)}add_cosignature(r,t){var e=this.ptr;this.ptr=0,A(r,rt);var _=n.transferoperationbuilder_add_cosignature(e,r.ptr,t);return Wr.__wrap(_)}builder(){try{n.transferoperationbuilder_builder(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}transaction(){try{n.transferoperationbuilder_transaction(8,this.ptr);var r=g()[2],t=g()[3];return m(r,t)}finally{n.__wbindgen_free(r,t)}}}class Zr{static __wrap(r){const t=Object.create(Zr.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_txoref_free(r)}static relative(r){j[0]=r;const t=k[0],e=k[1];var _=n.txoref_relative(t,e);return Zr.__wrap(_)}static absolute(r){j[0]=r;const t=k[0],e=k[1];var _=n.txoref_absolute(t,e);return Zr.__wrap(_)}}class rt{static __wrap(r){const t=Object.create(rt.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_xfrkeypair_free(r)}get pub_key(){var r=n.__wbg_get_xfrkeypair_pub_key(this.ptr);return tt.__wrap(r)}set pub_key(r){A(r,tt);var t=r.ptr;r.ptr=0,n.__wbg_set_xfrkeypair_pub_key(this.ptr,t)}}class tt{static __wrap(r){const t=Object.create(tt.prototype);return t.ptr=r,t}free(){const r=this.ptr;this.ptr=0,n.__wbg_xfrpublickey_free(r)}}const et=function(r){o(r)},_t=function(r,t){const e=s(t);var _=b(JSON.stringify(void 0===e?null:e),n.__wbindgen_malloc,n.__wbindgen_realloc),a=p;g()[r/4+1]=a,g()[r/4+0]=_},nt=function(r,t){return h(m(r,t))},at=function(r,t){return h(JSON.parse(m(r,t)))},it=vr((function(r,t){s(r).getRandomValues(s(t))})),st=vr((function(r,t,e){s(r).randomFillSync(cr(t,e))})),ct=vr((function(){return h(self.self)})),ot=function(){return h(r)},pt=vr((function(r,t,e){return h(s(r).require(m(t,e)))})),lt=function(r){return h(s(r).crypto)},ut=function(r){return h(s(r).msCrypto)},dt=function(r){return void 0===s(r)},ft=vr((function(){return h(self.self)})),bt=function(){return h(r)},wt=function(r,t,e){return h(s(r).require(m(t,e)))},gt=function(r){return h(s(r).crypto)},yt=function(r){return h(s(r).msCrypto)},mt=function(r){return h(s(r).getRandomValues)},ht=function(r,t){s(r).getRandomValues(s(t))},vt=function(r,t,e){s(r).randomFillSync(cr(t,e))},kt=function(r){return h(s(r).buffer)},jt=function(r){return s(r).length},Ot=function(r){return h(new Uint8Array(s(r)))},xt=function(r,t,e){s(r).set(s(t),e>>>0)},At=function(r){return h(new Uint8Array(r>>>0))},St=function(r,t,e){return h(s(r).subarray(t>>>0,e>>>0))},Ct=function(r,t){var e=b(v(s(t)),n.__wbindgen_malloc,n.__wbindgen_realloc),_=p;g()[r/4+1]=_,g()[r/4+0]=e},Pt=function(r,t){throw new Error(m(r,t))},$t=function(r){throw o(r)},Rt=function(){return h(n.memory)}}))},801:(r,t,e)=>{"use strict";var _=([_])=>e.v(t,r.id,"8e2c0db64309ac9ffac3",{"./wasm_bg.js":{__wbindgen_object_drop_ref:_.ug,__wbindgen_json_serialize:_.r1,__wbindgen_string_new:_.h4,__wbindgen_json_parse:_.t$,__wbg_getRandomValues_57e4008f45f0e105:_.E_,__wbg_randomFillSync_d90848a552cbd666:_.L7,__wbg_self_f865985e662246aa:_.MY,__wbg_static_accessor_MODULE_39947eb3fe77895f:_.f$,__wbg_require_c59851dfa0dc7e78:_.sV,__wbg_crypto_bfb05100db79193b:_._y,__wbg_msCrypto_f6dddc6ae048b7e2:_.Yj,__wbindgen_is_undefined:_.XP,__wbg_self_86b4b13392c7af56:_.U5,__wbg_static_accessor_MODULE_452b4680e8614c81:_.DA,__wbg_require_f5521a5b85ad2542:_.r2,__wbg_crypto_b8c92eaac23d0d80:_.iY,__wbg_msCrypto_9ad6677321a08dd8:_.mS,__wbg_getRandomValues_dd27e6b0652b3236:_.yX,__wbg_getRandomValues_e57c9b75ddead065:_.ae,__wbg_randomFillSync_d2ba53160aec6aba:_.Os,__wbg_buffer_eb5185aa4a8e9c62:_.ig,__wbg_length_2e324c9c0e74a81d:_.Be,__wbg_new_3d94e83f0a6bf252:_.Ls,__wbg_set_d4d7629a896d4b3e:_.$$,__wbg_newwithlength_02a009c0728d3ba1:_.IS,__wbg_subarray_cc54babc55409ee0:_.sP,__wbindgen_debug_string:_.fY,__wbindgen_throw:_.Or,__wbindgen_rethrow:_.nD,__wbindgen_memory:_.oH}});e.a(r,(r=>{var t=r([e(703)]);return t.then?t.then(_):_(t)}),1)}};
//# sourceMappingURL=547.bundle.node.js.map