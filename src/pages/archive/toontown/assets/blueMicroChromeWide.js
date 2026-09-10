// foo = window.location
//   .toString()
//   .indexOf("http://disney.go.com/home/html/index.html");
// if (!document.getElementById && foo == -1)
//   top.location.replace("http://disney.go.com/home/html/index.html");
var jumbo_footer_color = "blue";
document.write(
  '<table width="770" cellspacing="0" cellpadding="0" border="0" bgcolor="#003399">',
);
document.write("<tr>");
document.write(
  '<td width="120"><a href="http://transfer.go.com/cgi/transfer.dll?srvc=dis&goto=http://disney.go.com/&name=mchrome_home" target="_top"><IMG SRC="./assets/disney_blue.gif" border="0" height="25" width="120"></a></td>',
);
document.write('<td valign="middle" width="428">');
document.write(breadCrumb);
document.write("</td>");
document.write(
  '<td width="125" align="left" valign="middle"><a href="http://transfer.go.com/cgi/transfer.dll?srvc=dis&goto=http://search.disney.go.com&name=mchrome_search" target="_top"><img src="./assets/magnifying_glass.gif" width="19" height="19" alt="" border="0" valign="middle" hspace="0" vspace="0" align="middle"><font color="#003399">&nbsp;</font><b><font color="white" face="arial,helvetica" size="-2">Search Disney</font></b></a></td>',
);
//document.write('<td width="99" align="center" valign="middle"><A HREF="javascript:void(0);" onClick="window.open(\'http://log.go.com/log?srvc=dis&guid=E1DE7DED-9299-42AC-89F0-A2DAD2474055&drop=0&addata=804:53734:173756:53734&a=1&goto=./assets/interstitial/hp_disclaimer.html\',\'disclaimerWindow\',\'toolbar=no,scrollbars=no,location=no,width=370,height=210\')"><img src="http://log.go.com/log?&amp;srvc=dis&amp;addata=804:53734:173756:53734&amp;target=&amp;method=GET&amp;svr=ntweb-16&amp;host=disney.go.com&amp;guid=E1DE7DED-9299-42AC-89F0-A2DAD2474055&amp;goto=http://adimages.go.com/ad/sponsors/hp/Nov_2003/hewl-82x23-0002.gif" border="0" width=82 height=23></A></td>');
document.write("</tr>");
document.write("</table>");
