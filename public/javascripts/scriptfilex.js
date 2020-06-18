
function showModal_k(titlemessage="no title",bodymessage="Dang it Kitchu.. Pull yourself together ")
{
 $('#mheader').html(titlemessage);
 $('#mmessage').html(bodymessage);
 $('#mm').modal();
}


function typed(elem)
{
	// showModal_k("info",elem.innerHTML+" was pressed");
	document.querySelector("#scanid").value+=elem.innerHTML;
}
function clearx()
	{
		document.querySelector("#scanid").value="";
	}


