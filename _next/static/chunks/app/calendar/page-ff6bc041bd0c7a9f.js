(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[85],{5650:(e,t,s)=>{Promise.resolve().then(s.bind(s,4995))},4995:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>y});var a=s(5155),l=s(2115),r=s(6046),n=s(5370),o=s(4984),i=s(866),c=s(4047),d=s(3629),x=s(2354),m=s(6939),g=s(7424),u=s(4587),h=s(5320);function b(e){let{currentMonth:t,setCurrentMonth:s,selectedDate:l,setSelectedDate:r}=e,n=e=>{s("prev"===e?(0,i.a)(t,1):(0,c.P)(t,1))},o=e=>{s("prev"===e?(0,d.d)(t,1):(0,x.e)(t,1))},b=e=>{r(new Date(t.getFullYear(),t.getMonth(),e))},f=(0,m.P)((0,g.w)(t)),p=(0,u.P)(t);return(0,a.jsxs)("aside",{className:"p-4 bg-gray-900 text-gray-300 rounded-lg shadow-md",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,a.jsx)("button",{onClick:()=>o("prev"),className:"text-lg text-gray-400 hover:text-gray-200",children:"<<"}),(0,a.jsx)("button",{onClick:()=>n("prev"),className:"text-lg text-gray-400 hover:text-gray-200",children:"<"}),(0,a.jsx)("h2",{className:"text-xl font-bold tracking-wide",children:(0,h.GP)(t,"MMMM yyyy")}),(0,a.jsx)("button",{onClick:()=>n("next"),className:"text-lg text-gray-400 hover:text-gray-200",children:">"}),(0,a.jsx)("button",{onClick:()=>o("next"),className:"text-lg text-gray-400 hover:text-gray-200",children:">>"})]}),(0,a.jsx)("div",{className:"grid grid-cols-7 gap-2 text-center mb-2",children:["S","M","T","W","T","F","S"].map((e,t)=>(0,a.jsx)("div",{className:"font-semibold text-gray-400 text-sm",children:e},t))}),(0,a.jsxs)("div",{className:"grid grid-cols-7 gap-2 text-center",children:[Array.from({length:f}).map((e,t)=>(0,a.jsx)("div",{className:"invisible",children:"x"},"empty-".concat(t))),Array.from({length:p},(e,t)=>t+1).map(e=>(0,a.jsx)("button",{className:"p-2 w-10 h-10 rounded-md flex items-center justify-center text-sm transition-colors\n              ".concat(l.getDate()===e&&l.getMonth()===t.getMonth()&&l.getFullYear()===t.getFullYear()?"bg-blue-500 text-white font-bold":"bg-gray-800 hover:bg-gray-700 text-gray-300"),onClick:()=>b(e),children:e},e))]})]})}function f(e){let{handleLogout:t,router:s,currentMonth:r,setCurrentMonth:n,selectedDate:o,setSelectedDate:i}=e,[c,d]=(0,l.useState)(!1),[x,m]=(0,l.useState)(!1),[g,u]=(0,l.useState)(!0),[h,f]=(0,l.useState)(!1),[p,y]=(0,l.useState)("SETTINGS DONT WORK");return(0,l.useEffect)(()=>{let e=localStorage.getItem("darkMode");null!==e&&u("true"===e);let t=localStorage.getItem("notifications");null!==t&&f("true"===t);let s=localStorage.getItem("userName");null!==s&&y(s)},[]),(0,a.jsx)("div",{className:"relative w-full",children:(0,a.jsxs)("nav",{className:"shadow-md px-8 py-4 flex justify-between items-center bg-gray-900 text-gray-300 rounded-lg",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold tracking-wide",children:"SmartPlanner"}),(0,a.jsxs)("div",{className:" relative inline-block overflow-visible before:absolute before:-top-6 before:-bottom-6  before:-left-6 before:-right-6 before:content-['']  before:bg-transparent before:pointer-events-auto before:z-0 ",onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[(0,a.jsx)("button",{className:"relative z-10 hover:text-gray-400 transition",children:"Calendar"}),(0,a.jsx)("div",{className:"\n                absolute left-1/2 top-full mt-3 transform -translate-x-1/2\n                bg-gray-800 shadow-lg rounded-lg p-4 w-[450px]\n                transition-all duration-300 z-20\n                ".concat(c?"opacity-100 translate-y-0 pointer-events-auto":"opacity-0 -translate-y-1 pointer-events-none","\n              "),children:(0,a.jsx)(b,{currentMonth:r,setCurrentMonth:n,selectedDate:o,setSelectedDate:i})})]})]}),(0,a.jsxs)("div",{className:"flex items-center space-x-12",children:[(0,a.jsxs)("div",{className:" relative inline-block overflow-visible before:absolute before:-top-6 before:-bottom-6  before:-left-6 before:-right-6 before:content-['']  before:bg-transparent before:pointer-events-auto before:z-0 ",onMouseEnter:()=>m(!0),onMouseLeave:()=>m(!1),children:[(0,a.jsx)("button",{className:"relative z-10 hover:text-gray-400 transition",children:"Settings"}),(0,a.jsxs)("div",{className:"\n                absolute left-1/2 top-full mt-3 transform -translate-x-1/2\n                bg-gray-800 shadow-lg rounded-lg p-4 w-[350px]\n                transition-all duration-300 z-20\n                ".concat(x?"opacity-100 translate-y-0 pointer-events-auto":"opacity-0 -translate-y-1 pointer-events-none","\n              "),children:[(0,a.jsx)("h2",{className:"text-xl font-bold text-center mb-4",children:"Quick Settings"}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block mb-1 font-semibold text-sm",children:"User Name"}),(0,a.jsx)("input",{type:"text",value:p,onChange:e=>y(e.target.value),className:"w-full p-2 rounded bg-gray-700 border border-gray-600 text-gray-300"})]}),(0,a.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,a.jsx)("span",{className:"text-sm font-semibold",children:"Dark Mode"}),(0,a.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,a.jsx)("input",{type:"checkbox",className:"sr-only peer",checked:g,onChange:()=>u(!g)}),(0,a.jsx)("div",{className:"w-11 h-6 bg-gray-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors"}),(0,a.jsx)("span",{className:"ml-2 text-sm",children:g?"On":"Off"})]})]}),(0,a.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,a.jsx)("span",{className:"text-sm font-semibold",children:"Notifications"}),(0,a.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,a.jsx)("input",{type:"checkbox",className:"sr-only peer",checked:h,onChange:()=>f(!h)}),(0,a.jsx)("div",{className:"w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-blue-600 transition-colors"}),(0,a.jsx)("span",{className:"ml-2 text-sm",children:h?"On":"Off"})]})]}),(0,a.jsx)("button",{onClick:()=>{localStorage.setItem("darkMode",g),localStorage.setItem("notifications",h),localStorage.setItem("userName",p),window.location.reload()},className:"w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition",children:"LOL THIS DOESNT DO ANYTHING"})]})]}),(0,a.jsx)("button",{onClick:t,className:"text-red-400 hover:text-red-600 transition",children:"Log Out"})]})]})})}function p(e){let{weekDays:t}=e,[s,r]=(0,l.useState)(t.map(()=>[])),n=(e,t)=>{if("Enter"===t.key&&""!==t.target.value.trim()){let a=[...s];a[e].push(t.target.value),r(a),t.target.value=""}};return(0,a.jsx)("div",{className:"flex flex-grow p-6 space-x-4",children:t.map((e,t)=>(0,a.jsxs)("div",{className:"flex-1 shadow-lg rounded-lg p-6 bg-gray-800 text-gray-300",children:[(0,a.jsxs)("h2",{className:"text-xl font-bold mb-3",children:[(0,h.GP)(e,"EEEE")," (",(0,h.GP)(e,"MM/dd"),")"]}),(0,a.jsx)("input",{type:"text",placeholder:"Add a task...",className:"w-full p-3 rounded bg-gray-700 text-gray-300 border border-gray-600",onKeyDown:e=>n(t,e)}),(0,a.jsx)("ul",{className:"mt-4",children:s[t].map((e,t)=>(0,a.jsx)("li",{className:"p-2 bg-gray-700 rounded mt-2",children:e},t))})]},t))})}function y(){let e=(0,r.useRouter)(),[t,s]=(0,l.useState)(new Date),[i,c]=(0,l.useState)([]),[d,x]=(0,l.useState)(new Date),[m,g]=(0,l.useState)(!0);(0,l.useEffect)(()=>{localStorage.getItem("userToken")?(u(t),g(!1)):e.push("/login")},[e,t]);let u=e=>{let t=(0,n.k)(e,{weekStartsOn:1});c(Array.from({length:7},(e,s)=>(0,o.f)(t,s)))};return m?(0,a.jsx)("div",{className:"flex h-screen justify-center items-center bg-gray-950 text-gray-300",children:(0,a.jsx)("div",{className:"text-center",children:(0,a.jsx)("p",{className:"text-2xl font-semibold animate-pulse",children:"Loading SmartPlanner..."})})}):(0,a.jsx)("div",{className:"flex h-screen bg-gray-950 text-gray-300",children:(0,a.jsxs)("div",{className:"flex flex-col flex-grow p-8",children:[(0,a.jsx)(f,{handleLogout:()=>{localStorage.removeItem("userToken"),e.push("/login")},router:e,currentMonth:d,setCurrentMonth:x,selectedDate:t,setSelectedDate:s}),(0,a.jsx)("div",{className:"mt-6",children:(0,a.jsx)(p,{weekDays:i})})]})})}s(5786)},5786:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[523,777,441,517,358],()=>t(5650)),_N_E=e.O()}]);