"use client"
import { useRef, useState, useEffect } from 'react';
import FeedLayout from "../components/FeedLayout";
import Jobs from '../components/Jobs'
export default function Page() {
    const [showConnections, setShowConnections] = useState(false);
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);

    const fetchConnections = async ()=>{
        try{
            const token = localStorage.getItem('token');
            const headers = token?{headers:{Authorization:`Bearer ${token}`}}:{};
            const res = await fetch('http://localhost:4000/connections', headers);
            if(res.ok){ const data = await res.json(); setConnections(data); }
            const r = await fetch('http://localhost:4000/connections/requests', headers);
            if(r.ok){ const dr = await r.json(); setRequests(dr); }
        }catch(err){ console.error(err); }
    };

    useEffect(()=>{ if(showConnections) fetchConnections(); },[showConnections]);

    const feedContainerRef = useRef(null);
  
    return <div className="bg-[#030712] h-[100dvh] text-white">
        <div className="position mx-auto max-w-7xl flex gap-2 overflow-hidden">

            {showConnections && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={()=>setShowConnections(false)}>
                    <div className="bg-white text-black rounded-lg p-6 w-96 max-h-[80vh] overflow-auto" onClick={e=>e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-3">Connections</h3>
                        <div>
                            <h4 className="font-semibold">Pending Requests</h4>
                            {requests.length===0 && <div className="text-sm text-gray-600">No pending requests</div>}
                            {requests.map(req=>(
                                <div key={req._id} className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="font-semibold">{req.requester.name}</div>
                                        <div className="text-sm text-gray-600">{req.requester.title || req.requester.email}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={async ()=>{ const token=localStorage.getItem('token'); await fetch('http://localhost:4000/connections/'+req._id+'/accept',{method:'PATCH',headers:{Authorization:'Bearer '+token}}); fetchConnections();}}>Accept</button>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={async ()=>{ const token=localStorage.getItem('token'); await fetch('http://localhost:4000/connections/'+req._id,{method:'DELETE',headers:{Authorization:'Bearer '+token}}); fetchConnections();}}>Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr className="my-3"/>
                        <div>
                            <h4 className="font-semibold">Your Connections</h4>
                            {connections.length===0 && <div className="text-sm text-gray-600">No connections yet</div>}
                            {connections.map(c=>(
                                <div key={c.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <div className="font-semibold">{c.user.name}</div>
                                        <div className="text-sm text-gray-600">{c.user.title || c.user.email}</div>
                                    </div>
                                    <div>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={async ()=>{ const token=localStorage.getItem('token'); await fetch('http://localhost:4000/connections/'+c.id,{method:'DELETE',headers:{Authorization:'Bearer '+token}}); fetchConnections();}}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="w-1/3 rounded-2xl bg-stone-900 h-[40vh] hidden lg:block">
                <div className="userCard">
                    <div className="relative w-full">
                        {/* Banner - keep height as is */}
                        <div className="banner">
                            <img
                                src="https://images.pexels.com/photos/30253408/pexels-photo-30253408/free-photo-of-enchanting-woman-in-floral-dress-by-tree.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                                alt="Banner"
                                className="object-cover object-center h-20 w-full"
                            />
                        </div>

                        {/* Profile image overlapping bottom */}
                        <div className="absolute left-1/3 transform -translate-x-1/2 -bottom-[45px]">
                            <img
                                src="https://images.pexels.com/photos/30253408/pexels-photo-30253408/free-photo-of-enchanting-woman-in-floral-dress-by-tree.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                                alt="Profile"
                                className="h-[90px] w-[90px] object-cover rounded-full border-4 border-white shadow"
                            />
                        </div>
                    </div>
                    <div className="user mt-16 mx-auto text-center">
                        <div className="name">
                            <h3 className="text-2xl font-bold">Aanya R.</h3>
                            <p className="text-sm text-gray-400 max-h-28 overflow-y-hidden hide-scrollbar">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis itaque corrupti ducimus magnam iure voluptates quos! Quae doloribus dolore, accusantium eaque ratione asperiores numquam obcaecati dolorum, laudantium nisi ullam dignissimos in ea natus non suscipit alias cupiditate repellat quisquam! Illum magnam eum pariatur modi fugit, porro a odit voluptate harum. Itaque minus soluta ab blanditiis minima.</p>
                            <span className="text-gray-200 font-normal text-sm">location: Bangalore</span>
                        </div>
                    </div>
                    <div className="btn mt-16 mx-auto text-center text-sm">
                        <button className="btn btn-primary bg-[#f9fbfc] w-full p-3 text-black hover:bg-gray-200 font-bold hover:underline" onClick={()=>setShowConnections(true)}>Your Connections</button>
                    </div>
                </div>
            </div>
            <div 
                ref={feedContainerRef}
                className="mainfeed w-3/3 border border-gray-500 h-[98dvh] overflow-y-scroll hide-scrollbar"
                data-feed-container="true"
            >
                <FeedLayout containerRef={feedContainerRef} />
            </div>
            <div className="rightbar w-2/6 border border-gray-500 h-[98dvh] hidden lg:block">
            <Jobs />
            </div>
        </div>
    </div>;
}