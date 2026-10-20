import {cookies} from 'next/headers';
const runtime=process.env;
export function configuration(){return {url:runtime.SUPABASE_URL||'',key:runtime.SUPABASE_ANON_KEY||'',master:runtime.NEURI_DATA_KEY||''}}
export function configured(){const c=configuration();return !!(c.url&&c.key&&c.master)}
export async function authFetch(path:string,body?:unknown,token?:string,method='POST'){const c=configuration();if(!configured())throw Error('El registro está pendiente de conectar al servicio de cuentas.');return fetch(`${c.url}/auth/v1/${path}`,{method,headers:{apikey:c.key,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'})}
export async function sessionTokens(access:string,refresh:string){const c=await cookies();const options={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/'};c.set('neuri_access',access,{...options,maxAge:3600});c.set('neuri_refresh',refresh,{...options,maxAge:604800})}
export async function clearSession(){const c=await cookies();c.delete('neuri_access');c.delete('neuri_refresh');c.delete('neuri_recovery')}
export async function getNeuriUser(){if(!configured())return null;const c=await cookies();let access=c.get('neuri_access')?.value;let r=access?await authFetch('user',undefined,access,'GET'):null;if(!r?.ok){const refresh=c.get('neuri_refresh')?.value;if(!refresh)return null;const rr=await authFetch('token?grant_type=refresh_token',{refresh_token:refresh});if(!rr.ok)return null;const t=await rr.json() as {access_token:string,refresh_token:string};try{await sessionTokens(t.access_token,t.refresh_token)}catch{return null}access=t.access_token;r=await authFetch('user',undefined,access,'GET')}if(!r?.ok)return null;const user=await r.json() as {id?:string,email?:string};return typeof user.id==='string'?{id:user.id,email:user.email,accessToken:access!}:null}
// Netlify can expose an internal deploy URL to the server while the browser uses the custom domain.
// Validate the browser origin against our own deployment origins, never forwarded host headers.
export function sameOrigin(req:Request){
 const origin=req.headers.get('origin');
 if(!origin||req.headers.get('sec-fetch-site')==='cross-site')return false;
 try{if(new URL(origin).origin!==origin)return false}catch{return false}
 const allowed=new Set(['https://neuri.xyz','https://www.neuri.xyz','https://teal-dango-f474d8.netlify.app','https://deploy-preview-1--teal-dango-f474d8.netlify.app']);
 for(const value of [runtime.DEPLOY_URL,runtime.DEPLOY_PRIME_URL]){if(!value)continue;try{const u=new URL(value);if(u.protocol==='https:'&&/^(?:[a-f0-9]{24}|deploy-preview-\d+)--teal-dango-f474d8\.netlify\.app$/.test(u.hostname))allowed.add(u.origin)}catch{}}
 if(runtime.NODE_ENV!=='production'){const u=new URL(req.url);if(['localhost','127.0.0.1','[::1]'].includes(u.hostname))allowed.add(u.origin)}
 return allowed.has(origin);
}
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});

export async function vaultFetch(path:string,access:string,method='GET',body?:unknown){const c=configuration();return fetch(`${c.url}/rest/v1/neuri_vaults${path}`,{method,headers:{apikey:c.key,Authorization:`Bearer ${access}`,'Content-Type':'application/json',Prefer:'return=representation'},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'})}
