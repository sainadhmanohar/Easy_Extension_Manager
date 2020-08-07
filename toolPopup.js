
//chrome.send("inspect",["local","DC8BF8135E2CA60F0F672C4AA1DFE48C"]) (chrome private, there is no access)
// chrome.developerPrivate.openDevTools (chrome private, there is no access)

var winId = 0;
var selfExtId;
var extensionId;
var extInBrowser;
var extSearchData = [];
var reloadImg ;
var checkboxStatus;
var idName;
var showEnabledData=false;
var showDisabledData = false;
var extEnabled = [];
var extDisabled = [];
var iconURL = "";
var extDevEnabled = [];
var extDevDisabled = [];
var extNormalEnabled = [];
var extNormalDisabled = [];
var moreEllipsis ;
var thisExtensionId;
var thisExtensionName;
var extType;
var prevExt = "";
var url;

// function to build 
var markup = function(extensionData,showListSeparate, displayData){
    $(".headings").css("display","block");
    if(displayData == "enabled"){
        $(".headings").eq(2).css("display","none");
        $(".headings").eq(3).css("display","none");
    }else if(displayData == "disabled"){
        $(".headings").eq(0).css("display","none");
        $(".headings").eq(1).css("display","none");
    }
    var insDevCount = 0;
    var insNormalCount = 0;
    var uinsDevCount = 0;
    var uinsNormalCount = 0;
    $.each(extensionData,function(idx,item){
        if(item.enabled){
            checkboxStatus = "checked";
            if(extEnabled.indexOf(item) == -1){
                extEnabled.push(item);
            }
            if(item.installType == "development"){
                insDevCount++;
                if(extDevEnabled.indexOf(item) == -1){
                    extDevEnabled.push(item);
                }
                
                idName = showListSeparate?"#extDevItem":"#filteredData";
                // $(idName).append(
                //     "<div><span>"+item.name+"</span><img src='downArrow3.png' width=18 class='downArrow'><label class='switch'><input style='float:right;' type='checkbox' extId='"+item.id+"' checked><span class='slider'></span></label></div></br>"
                // );
                //}else if(item.installType == "normal"){
            }else{
                insNormalCount++;
                if(extNormalEnabled.indexOf(item) == -1){
                    extNormalEnabled.push(item);
                }
                idName = showListSeparate?"#extNormalItem":"#filteredData";
            }
            reloadImg = "<img src='icons/reload4.png' class='reload'>";
        }else{
            checkboxStatus = "unchecked";
            if(extDisabled.indexOf(item) == -1){
                extDisabled.push(item);
            }
            if(item.installType == "development"){
                uinsDevCount++;
                if(extDevDisabled.indexOf(item) == -1){
                    extDevDisabled.push(item);
                }
                idName = showListSeparate?"#extDisabledDevItem":"#filteredData";
                // $(idName).append(
                //     "<div><span>"+item.name+"</span><img src='downArrow3.png' width=18 class='downArrow'><label class='switch'><input style='float:right;' type='checkbox' extId='"+item.id+"'"+ checkboxStatus+"><span class='slider'></span></label></div></br>"
                // );
                //}else if(item.installType == "normal"){
            }else{
                uinsNormalCount++;
                if(extNormalDisabled.indexOf(item) == -1){
                    extNormalDisabled.push(item);
                }
                idName = showListSeparate?"#extDisabledNormalItem":"#filteredData";
            }
            reloadImg = ""
        }
        iconURL = "";
        if(item.icons && item.icons.length){
            iconURL = item.icons[item.icons.length-1]["url"];
        }else if(iconURL == ""){
            iconURL = "chrome://extension-icon/"+item.id+"/256/0";
        }
        $(idName).append(
            "<div extId='"+item.id+"' type='"+item.isApp+"'><span class='extIcon'><img src='"+iconURL+"'/></span><span extInstallType ='"+item.installType+"' id='extName'>"+item.name+"</span><img src='icons/downArrow3.png' width=18 class='downArrow'>"+reloadImg+"<label class='switch'><input style='float:right;' type='checkbox'"+ checkboxStatus+"><span class='slider'></span></label><img src='icons/ellipsis_icon.png' class='ellipsisIcon' width=24 style='float:left; margin-top: 4px'></div></br>"
        );
         
        // hide reload and switch button for "Easy Extension Manager"
        if(selfExtId == item.id){
            $("div[extId='"+selfExtId+"']").find(".reload").css("display","none");
            $("div[extId='"+selfExtId+"']").find(".switch").css("display","none");
        }
    });
    $("#insDevHeading").text(" - "+insDevCount);
    $("#insNormalHeading").text(" - "+insNormalCount);
    $("#uinsDevHeading").text(" - "+uinsDevCount);
    $("#uinsNormalHeading").text(" - "+uinsNormalCount);
}

// chrome.windows.getCurrent(null,function(windowData){
//     winId = windowData;   
//     console.log(winId);
//     chrome.runtime.sendMessage({
//         printOutput: true,
//         abcd: "success",
//         windowObj: winId
//     });
// })
// chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//     var info = message.tabInfo
//     console.log(message.tabInfo)
// });

var findAndCreateTAb = function (urlName,title){
    chrome.windows.getCurrent(null,function(windowData){
        
        var tabFound = false;
        //var searchComplete = false;
        chrome.tabs.query({
            windowId: windowData.id,
            url: "<all_urls>"
        },function(tabs){
            console.log(tabs);
            $.each(tabs,function(indx,item){
                if( item.title == title/* item.url == urlName */){
                    chrome.tabs.update(parseInt(item.id),{active: true});
                    tabFound = true;
                }
            });
            //searchComplete = true;
            if(/* searchComplete &&  */!tabFound){
                chrome.tabs.create({
                    url: urlName,
                    active: true
                });
            }
        });
    });
}

// go to "chrome://extensions" tab
$("#homeIcon").click(function(ev){
    //console.log(ev)
    findAndCreateTAb("chrome://extensions/","Extensions");
});

// search for extension
$("#inputSearch").keyup(function(e){
    console.log(e.target.value);
    extSearchData = [];
    $(".extData").empty();
    var searchFieldText = e.target.value;
    if(e.target.value.trim() != ""){
        $("#searchIcon").hide();
        $("#clearIcon").show();
        $.each(extInBrowser,function(index, item){
            if(item["name"].toLowerCase().indexOf(searchFieldText.toLowerCase()) > -1){
                console.log("matched");
                if(extSearchData.indexOf(item) == -1){
                    extSearchData.push(item);
                }
            }
        });
        markup(extSearchData, true, "showAll");
    }else {
        $("#searchIcon").show();
        $("#clearIcon").hide();
        markup(extInBrowser, true, "showAll");
    }
    
});

// clear search field
$("#clearIcon").click(function(){
    $("#searchIcon").show();
    $("#clearIcon").hide();
    if($("#inputSearch").val() != ""){
        $("#inputSearch").val("");
        $(".extData").empty();
        markup(extInBrowser, true, "showAll");
    }
});

//main extension data in popup
$(document).ready(function(){
    chrome.management.getSelf(function(extInfo){
        selfExtId = extInfo.id;
    });
    chrome.management.getAll(function(extensionList){
        console.log(extensionList);
        extInBrowser = extensionList;
        extInBrowser.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        extNamesInBrowser = [];
        markup(extInBrowser, true, "showAll");
    });
    
    $(".extData").on("click","input",function(it){
        it.stopPropagation();
        console.log(it);
        var parentEle = $(this).parentsUntil(".extData")[1];
        extensionId = $(parentEle).attr("extId");
        chrome.management.setEnabled(extensionId,it.target.checked,function(data){
            console.log(data);
            if(!it.target.checked){
                $(parentEle).find(".reload").css("display","none");
            }else{
                $(parentEle).find(".reload").css("display","inline-block");
            }
        });
    });
    
    $(".extData").on("click",".reload",function(e){
        e.stopPropagation();
        //var extStatus = false;
        $this = $(this);
        // //location.reload();
        if($this.hasClass("rotate")){
            $this.removeClass("rotate");
        }
        extensionId = $(this).parent().attr("extId");
        extStatus = $(this).parent().find("input")[0].checked; // result: true
        // $($(this).parent().find("input")[0]).attr("checked") result: "checked"
        chrome.management.setEnabled(extensionId,!extStatus,function(){
            $this.addClass("rotate");
            chrome.management.setEnabled(extensionId,extStatus);
        });
    });
    
    $(".extData").on("click",".downArrow",function(e){
        e.stopPropagation();
        extensionId = $(this).parent().attr("extId");
        var descrpt = "";
        if($(this).attr("src") == "icons/downArrow3.png"){
            $(this).attr("src","icons/downArrow4.png");
            var $this = $(this);
            chrome.management.get(extensionId, function(extInfo){
                descrpt = extInfo.description != "" ? extInfo.description : '"There is no description to mention"' ;
                //$this.parent().find(".extDescription").text(descrpt)
                $this.parent().append("<span id='"+extensionId+"_Description' style='font-size: 12px; display: block; margin-left: 10px;'>Description: "+descrpt+"</span>")
                //$("#"+extensionId+"_Description").text(descrpt)
                //$this.siblings().find(".extDescription").text(descrpt)
            });
        }else{
            $(this).attr("src","icons/downArrow3.png");
            //$("#"+extensionId+"_Description").text(descrpt);
            $(this).parent().find("#"+extensionId+"_Description").remove();
        }
    });
    
    $(".extData").on("click",".ellipsisIcon",function(event){
        console.log($(this),this.parentElement.offsetTop);
        event.stopPropagation();
        //$("#more").hide();
       
        extType = $(this).parent().attr("type");
        var topy = this.offsetParent.offsetTop+this.parentElement.offsetTop-34;
        thisExtensionId = $(this).parent().attr("extId");
        thisExtensionName = $(this).parent().find("#extName").text();
        thisExtensionInstallType = $(this).parent().find("#extName").attr("extInstallType");
        console.log(thisExtensionName)
        //var topy = event.clientY ;
        if($("#extDataContainer").find("#more").length == 0){
            moreEllipsis = `<div id='more' style='top:`+ topy+`px; left:42px;'> 
                                <div id='rightTriangle'></div>
                                <div id='moreOptions'>   
                                    <p id="launchExt">
                                        <span>Launch</span>
                                    </p> 
                                    <div id="errorText"></div>  
                                    <div id = "dbTriangle"  style="
                                    position: absolute;
                                    right: 28px;
                                    display: none;
                                    width: 0;
                                    height: 0;
                                    top: 18px;
                                    border-right: 10px solid #3538b1;
                                    border-bottom: 10px solid transparent;
                                    border-top: 10px solid transparent;
                                "> 
                                    <div style="
                                            position: absolute;
                                            right: -11px;
                                            display: inline-block;
                                            width: 0;
                                            top: -8px;
                                            height: 0;
                                            border-right: 8px solid #a1c7ec;
                                            border-bottom: 8px solid transparent;
                                            border-top: 8px solid transparent;
                                        ">
                                    </div>
                                </div>
                                
                                    <p id="uninstallExt"><span>Uninstall</p>   
                                    <p id="chromeWebStore">In Chrome Store</p>
                                </div> 
                            </div>`;
            $("#extDataContainer").append(moreEllipsis);
        }else{
            $("#errorText").css("display","none");
            $("#dbTriangle").css("display","none");
        }
        $("#more").css({"top":topy+"px"});
            // if($(this) ! = prevThis){
             //$("#more").toggle();
            // }
            //prevThis = $(this);
        //var topy = this.parentElement.offsetTop;
        if($("#more").css("display") == "none"){
            //this.parentElement.innerHTML += moreEllipsis;
            $("#more").show();
        }else if(prevExt != thisExtensionId){
            $("#more").show();
        }else{
            $("#more").hide();
        }
        prevExt = thisExtensionId;
    })

    $("#extDataContainer").on("click","#launchExt",function(){
        console.log("launched");
        if(extType == "true"){
            // $("#errorText").css("display","none");
            // $("#dbTriangle").css("display","none");
            chrome.management.launchApp(thisExtensionId,function(){
                console.log("launchedApp");
            });
        }else{
            $("#errorText").css("display","inline-block");
            $("#dbTriangle").css("display","inline-block");
            $("#errorText").text("This is not an APP (Only APPs can be launched)");
            $("#errorText").css({"top":"4px","right" : "-154px"});
            $("#dbTriangle").css({"top":"17px","right" : "8px"})
            // top: 6px;   right: -134px;
        }
        
    });

    $("#extDataContainer").on("click","#uninstallExt",function(){
       
        chrome.management.uninstall(thisExtensionId,{showConfirmDialog: true},function(){
            console.log("uninstalled");
        })
    });

    $("#extDataContainer").on("click","#chromeWebStore",function(){
        //url = "https://chrome.google.com/webstore/detail/"+thisExtensionId;
        //$("#chromeWebStore").find("a").attr("href",url);
       
        if(thisExtensionInstallType == "normal"){
            findAndCreateTAb("https://chrome.google.com/webstore/detail/"+thisExtensionId,thisExtensionName+" - Chrome Web Store");
        }else{
            $("#errorText").css("display","inline-block");
            $("#dbTriangle").css("display","inline-block");
            $("#errorText").text("No home page url - As \"Install Type: Development\"");
            $("#errorText").css({"top":"68px","right" : "-154px"})
            $("#dbTriangle").css({"top":"81px","right" : "8px"})
        }
    });    



    $(document).click(function(e){
        if(e.target.offsetParent && (e.target.offsetParent.id).substr(0,11) != "filterPopup"){
            $("#filterPopup").css("display","none");
        }
        if(e.target.offsetParent && e.target.offsetParent.id != "more"){
            $("#more").hide();
        }
    });
    

    $("#filterIcon").click(function(e){
        e.stopPropagation();
        var filterPopup = $("#filterPopup");
        if(e.target.id == "filterIcon" && filterPopup.css("display") == "none"){
            filterPopup.css("display","block");
            //$("#filterIcon").attr("src","filter_icon_active.png");
            //$("#filterIcon").css("content",'url("filter_icon_active.png")');
        }else if(e.target.id == "filterIcon"){
            filterPopup.css("display","none");
        }
    });
    
    $("#filterIcon").hover(function(e){
        e.stopPropagation();
        if(e.type == "mouseenter"){
            if($("#filterIcon").attr("src") == "icons/filter_icon.png"){
                $("#filterIcon").attr("src","icons/filter_icon_active.png");
            }
        }else if(e.type == "mouseleave"){
            if($("#filterIcon").attr("src") == "icons/filter_icon_active.png"){
                $("#filterIcon").attr("src","icons/filter_icon.png");
            }
            /* if($("#filterIcon").css("content") == "url("+'"chrome-extension://ehefccfamejjgaejmcoaiemhjjjdnadp/filter_icon_active.png"'+")"){
                $("#filterIcon").css("content",'url("filter_icon.png")');
            } */
        }
    });
    $(".filter").on("change",function(e){
        //$(".filter").not(this).prop("checked",false); if checkboxes are used instead of radio buttons
        e.stopPropagation();
        $(".extData").empty();
        var extSearchEnabled = [];
        var extSearchDisabled = [];
        var searchField = $("#inputSearch").val().trim();
        if(extSearchData.length){
            showData = extSearchData;
            $.each(extSearchData,function(index, item){
                if(item.enabled){
                    if(extSearchEnabled.indexOf(item) == -1){
                        extSearchEnabled.push(item);
                    }
                }else{
                    if(extSearchDisabled.indexOf(item) == -1){
                        extSearchDisabled.push(item);
                    }
                }
            });
        }else{
            showData = extInBrowser;
        }
        //extSearchData
        
        
        filterApplied = "showAll"
        if($("#filterShowEnabled").prop("checked")){
            if(extSearchData.length){
                showData = extSearchEnabled;
            }else{
                showData = extEnabled;
            }
            filterApplied = "enabled"
        }else if($("#filterShowDisabled").prop("checked")){
            if(extSearchData.length){
                showData = extSearchDisabled;
            }else{
                showData = extDisabled;
            }
            filterApplied = "disabled";
        }
        markup(showData, true, filterApplied);
    });
    $("#closeFilter").click(function(e){
        e.stopPropagation();
        $("#filterPopup").css("display","none");
    });
});
