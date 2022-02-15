let myleads=[]

const inputEl = document.getElementById("inputE")
const inputBTN = document.getElementById("input-btn")
const ulEl = document.getElementById("ulel")
inputBTN.addEventListener("click",function(){
    myleads = JSON.parse(myleads)
    inputEl.value = ''
    myleads.push(inputEl.value)
    localStorage.setItem("myleads",JSON.stringify(myleads))
    render()
    

})

let listitems = ""
let i = 0
function render(){
for(; i<myleads.length; i++){
    listitems += `<li>
    <a target='_blank' href='${myleads[i]}'>
        ${myleads[i]}
    </a>
    </li>
    `
    
}
ulEl.innerHTML = listitems
}