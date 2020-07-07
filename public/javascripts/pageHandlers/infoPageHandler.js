function showImagexx(imgx){
document.getElementsByTagName("body")[0].style.backgroundImage=`url('/uploads/${imgx}')`;
document.getElementsByTagName("body")[0].style.backgroundRepeat="no-repeat";
document.getElementsByTagName("body")[0].style.backgroundSize="cover";
}