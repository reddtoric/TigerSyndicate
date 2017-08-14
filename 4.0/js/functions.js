var RankedImgPath = "/imgs/rankedAvatar.jpg";
var AmateurImgPath = "/imgs/amateurAvatar.jpg";
var CasualImgPath = "/imgs/casualAvatar.jpg";

var GamesDataFile = "/json/games.json";
var FAQDataFile = "/json/faq.json";
var OrgInfoDataFile = "/json/organization-info.json";
var MembersDataFile = "/json/members.json";

var content = $("#content");
//var contentTitle = $("#contentTitle");
var innerContent = document.getElementById("innerContent");
var Popup = null;

var SortedMembersData = null;
var SortedRankedMembers = null;
var SortedAmateurMembers = null;
var SortedCasualMembers = null;

function GetJson(lambdaFunction, dataFile){
    $.getJSON(dataFile, function(data){
        //empty
    }).done(function(data){
        lambdaFunction(data);
    });
}

function ExitPopUp(){
    $(".indepthMemberCardPopUpBg").remove();
}

function DisplayAllMembers(){
    var lambdaFunction = function(data){
        if(SortedMembersData === null){
            SortedMembersData = data.Members;
            SortedMembersData = SortedMembersData.sort(function (a, b){
                if(b.name < a.name)
                    return 1;
                else if(a.name < b.name)
                    return -1;
                else
                    return 0;
            });
        }
        
        if(SortedRankedMembers === null){
            SortedRankedMembers = SortedMembersData.filter(function(item){
                return item.type === "ranked";
            });
        }
        
        if(SortedAmateurMembers === null){
            SortedAmateurMembers = SortedMembersData.filter(function(item){
                return item.type === "amateur";
            });
        }
        
        if(SortedCasualMembers === null){
            SortedCasualMembers = SortedMembersData.filter(function(item){
                return item.type === "casual";
            });
        }
        
        
        $.each(SortedRankedMembers, function(i, item){
            makeMiniMemberCard(item, RankedImgPath);
        });
        
        $.each(SortedAmateurMembers, function(i, item){
            makeMiniMemberCard(item, AmateurImgPath);
        });
        
        $.each(SortedCasualMembers, function(i, item){
            makeMiniMemberCard(item, CasualImgPath);
        });
    };//end lambda function
    
    GetJson(lambdaFunction, MembersDataFile);
}

function DisplayFAQ(){
    var lambdaFunction = function(data){
        var faqContainer = document.createElement("div");
        faqContainer.id = "faqContainer";
        
            var h2 = document.createElement("h2");
            var h2Text = document.createTextNode("Frequently Asked Questions");
            h2.appendChild(h2Text);
            faqContainer.appendChild(h2);
        
            $.each(data.FAQ, function(i, item){
                var pQ = document.createElement("p");
                var Qtext = "Q: " + item.Q;
                var pQText = document.createTextNode(Qtext);
                pQ.appendChild(pQText);
                faqContainer.appendChild(pQ);
                
                var pA = document.createElement("p");
                var Atext = "A: " + item.A;
                var pAText = document.createTextNode(Atext);
                pA.appendChild(pAText);
                faqContainer.appendChild(pA);
            });
            
        innerContent.appendChild(faqContainer);
    };//end of lambda function
    
    GetJson(lambdaFunction, FAQDataFile);
}

function DisplayContact(){
    var lambdaFunction = function(data){
        var OrgInfo = data.TigerSyndicateInfo
        
        var href = "mailto: " + OrgInfo.contact_email;
        var contactLink = document.getElementById("contactLink");
        contactLink.setAttribute("href", href);
        var contactLinkText = document.createTextNode(OrgInfo.contact_email);
        contactLink.appendChild(contactLinkText);
        
        
        
        var twitchLink = document.getElementById("twitchLink");
        if(OrgInfo.twitch != "" || OrgInfo.twitch != undefined)
            twitchLink.setAttribute("href", OrgInfo.twitch);
        else
            twitchLink.remove();
            
        var twitterLink = document.getElementById("twitterLink");
        if(OrgInfo.twitter != "" || OrgInfo.twitter != undefined)
            twitterLink.setAttribute("href", OrgInfo.twitter);
        else
            twitterLink.remove();
            
        var facebookLink = document.getElementById("facebookLink");
        if(OrgInfo.facebook != "" || OrgInfo.facebook != undefined)
            facebookLink.setAttribute("href", OrgInfo.facebook);
        else
            facebookLink.remove();
            
        var discordLink = document.getElementById("discordLink");
        if(OrgInfo.discord != "" || OrgInfo.discord != undefined)
            discordLink.setAttribute("href", OrgInfo.discord);
        else
            discordLink.remove();
            
        var youtubeLink = document.getElementById("youtubeLink");
        if(OrgInfo.youtube != "" || OrgInfo.youtube != undefined)
            youtubeLink.setAttribute("href", OrgInfo.youtube);
        else
            youtubeLink.remove();
            
        var steamLink = document.getElementById("steamLink");
        if(OrgInfo.steam != "" || OrgInfo.steam != undefined)
            steamLink.setAttribute("href", OrgInfo.steam);
        else
            steamLink.remove();
            
        var google_plusLink = document.getElementById("google_plusLink");
        if(OrgInfo.google_plus != "" || OrgInfo.google_plus != undefined)
            google_plusLink.setAttribute("href", OrgInfo.google_plus);
        else
            google_plusLink.remove();
    };//end of lambda function
    
    GetJson(lambdaFunction, OrgInfoDataFile);
}

function ListGames(){
    var lambdaFunction = function(data){
        $.each(data.GameList, function(i, item){
            var a = document.createElement("a");
            a.className = "gamesbtn";
            a.id = item.id;
            a.setAttribute("title", item.title);
            var href = "/teams/" + item.id + "/";
            a.setAttribute("href", href);
            innerContent.appendChild(a);
        });
   };
   
   GetJson(lambdaFunction, GamesDataFile);
}

function IndepthMemberCardPopup(id){
    var selectedMember = SortedMembersData.find(function(item){
        return (item.id === id.toString());
    });
    
    var indepthMemberCardPopUpBg = document.createElement("div");
    indepthMemberCardPopUpBg.className = "indepthMemberCardPopUpBg";
    //indepthMemberCardPopUpBg.setAttribute("onclick", "ExitPopUp()");
    Popup = indepthMemberCardPopUpBg;
    
        var div_spacer1 = document.createElement("div");
        div_spacer1.className = "col-1";
        indepthMemberCardPopUpBg.appendChild(div_spacer1);
        
        var div_col_10 = document.createElement("div");
        div_col_10.className = "col-10";
        
            var indepthMemberCard = makeIndepthMemberCard(selectedMember);
            div_col_10.appendChild(indepthMemberCard);
            indepthMemberCardPopUpBg.appendChild(div_col_10);
        
        var div_spacer2 = document.createElement("div");
        div_spacer2.className = "col-1";
        indepthMemberCardPopUpBg.appendChild(div_spacer2);
    
    $("body").append(indepthMemberCardPopUpBg);
}

function makeIndepthMemberCard(selectedMember){
    var indepthMemberCard = document.createElement("div");
    indepthMemberCard.className = "memberCard";
    
    var memberImgContainer = document.createElement("div");
    memberImgContainer.className = "memberImgContainer";
    
        var img = document.createElement("img");
        img.className = "memberImg";
        if(selectedMember.img_path === "" || selectedMember.img_path === undefined){
            img.setAttribute("src", "/imgs/black.png");
        }
        else{
            img.setAttribute("src", selectedMember.img_path);
        }
        memberImgContainer.appendChild(img);
        
    indepthMemberCard.appendChild(memberImgContainer);
    
    var memberContentContainer = document.createElement("div");
    memberContentContainer.className = "memberContentContainer";
    
        //todo: how to display all the igns
        
        var name = document.createElement("name");
        var nameText = document.createTextNode(selectedMember.name);
        name.appendChild(nameText);
        memberContentContainer.appendChild(name);
    
    
    indepthMemberCard.appendChild(memberContentContainer);
    
    return indepthMemberCard;
}

function makeMiniMemberCard(item, imgPath){
    var miniMemberCard = document.createElement("div");
    miniMemberCard.className = "miniMemberCard";
    var onclick = "IndepthMemberCardPopup('" + item.id + "')";
    miniMemberCard.setAttribute("onclick", onclick);
    
        var img = document.createElement("img");
        img.className = "miniMemberImg";
        img.setAttribute("src", imgPath);
        miniMemberCard.appendChild(img);
        
        var miniMemberContentContainer = document.createElement("div");
        miniMemberContentContainer.className = "miniMemberContentContainer";
            
            var name = document.createElement("name");
            var nameText = document.createTextNode(item.name);
            name.appendChild(nameText);
            miniMemberContentContainer.appendChild(name);
            
        miniMemberCard.appendChild(miniMemberContentContainer);
        
    //$("#miniMemberCardContainer").append(miniMemberCard);
    innerContent.appendChild(miniMemberCard);
}

function makeMemberCard(item, ign){
    var memberCard = document.createElement("div");
    memberCard.className = "memberCard";
    
        var memberImgContainer = document.createElement("div");
        memberImgContainer.className = "memberImgContainer";
        
            var img = document.createElement("img");
            img.className = "memberImg";
            if(item.img_path === "" || item.img_path === undefined)
                img.setAttribute("src", "/imgs/black.png");
            else
                img.setAttribute("src", item.img_path);
            memberImgContainer.appendChild(img);
            
        memberCard.appendChild(memberImgContainer);
            
        var memberContentContainer = document.createElement("div");
        memberContentContainer.className = "memberContentContainer";
            
            var ignNode = document.createElement("ign");
            var ignText = document.createTextNode(ign);
            ignNode.appendChild(ignText);
            memberContentContainer.appendChild(ignNode);
            
            var name = document.createElement("name");
            var nameText = document.createTextNode(item.name);
            name.appendChild(nameText);
            memberContentContainer.appendChild(name);
            
            var desc = document.createElement("desc");
            var descText = document.createTextNode(item.desc);
            desc.appendChild(descText);
            memberContentContainer.appendChild(desc);
            
            var memberLinksContainer = document.createElement("div");
            memberLinksContainer.classList = "memberLinksContainer";
            
                if(item.twitch === "" || item.twitch === undefined){
                    //empty
                }
                else{
                    var a = document.createElement("a");
                    a.setAttribute("href", item.twitch);
                    a.setAttribute("target", "_blank");
                    
                        var i = document.createElement("i");
                        i.className = "fa fa-twitch twitchIcon";
                        i.setAttribute("title", "Twitch");
                        i.setAttribute("aria-hidden", "true");
                        a.appendChild(i);
                        
                    memberLinksContainer.appendChild(a);
                }
                
                if(item.twitter === "" || item.twitter === undefined){
                    //empty
                }
                else{
                    var a = document.createElement("a");
                    a.setAttribute("href", item.twitter);
                    a.setAttribute("target", "_blank");
                    
                        var i = document.createElement("i");
                        i.className = "fa fa-twitter twitterIcon";
                        i.setAttribute("title", "Twitter");
                        i.setAttribute("aria-hidden", "true");
                        a.appendChild(i);
                        
                    memberLinksContainer.appendChild(a);
                }
                
                if(item.steam === "" || item.steam === undefined){
                    //empty
                }
                else{
                    var a = document.createElement("a");
                    a.setAttribute("href", item.steam);
                    a.setAttribute("target", "_blank");
                    
                        var i = document.createElement("i");
                        i.className = "fa fa-steam steamIcon";
                        i.setAttribute("title", "Steam");
                        i.setAttribute("aria-hidden", "true");
                        a.appendChild(i);
                        
                    memberLinksContainer.appendChild(a);
                }
                
                if(item.discord === "" || item.discord === undefined){
                    //empty
                }
                else{
                    var a = document.createElement("a");
                    a.setAttribute("href", item.discord);
                    a.setAttribute("target", "_blank");
                    
                        var div = document.createElement("div");
                        div.className = "discordIcon";
                        div.setAttribute("title", "Discord");
                        div.setAttribute("aria-hidden", "true");
                        a.appendChild(div);
                        
                    memberLinksContainer.appendChild(a);
                }
                
            memberContentContainer.appendChild(memberLinksContainer);
            
        memberCard.appendChild(memberContentContainer);
            
    innerContent.appendChild(memberCard);
}

function DisplayMembersForTeamPage(id, title){
    var logo2 = document.getElementById("logo2");
    logo2.className = "gameTitle";
    logo2.id = id;
    logo2.setAttribute("title", title);
    
    var lambdaFunction = function(data){
        $.each(data.Members, function(i, item){
            if(item.type == "ranked"){
                if(id == "bladeandsoul" && item.bladeandsoul != undefined){
                    makeMemberCard(item, item.bladeandsoul);
                }
                else if(id == "brawlhalla" && item.brawlhalla != undefined){
                    makeMemberCard(item, item.brawlhalla);
                }
                else if(id == "companyofheroes" && item.companyofheroes != undefined){
                    makeMemberCard(item, item.companyofheroes);
                }
                else if(id == "counterstrikego" && item.counterstrikego != undefined){
                    makeMemberCard(item, item.counterstrikego);
                }
                else if(id == "darksouls3" && item.darksouls3 != undefined){
                    makeMemberCard(item, item.darksouls3);
                }
                else if(id == "destiny" && item.destiny != undefined){
                    makeMemberCard(item, item.destiny);
                }
                else if(id == "dota2" && item.dota2 != undefined){
                    makeMemberCard(item, item.dota2);
                }
                else if(id == "hearthstone" && item.hearthstone != undefined){
                    makeMemberCard(item, item.hearthstone);
                }
                else if(id == "heroesofthestorm" && item.heroesofthestorm != undefined){
                    makeMemberCard(item, item.heroesofthestorm);
                }
                else if(id == "leagueoflegends" && item.leagueoflegends != undefined){
                    makeMemberCard(item, item.leagueoflegends);
                }
                else if(id == "overwatch" && item.overwatch != undefined){
                    makeMemberCard(item, item.overwatch);
                }
                else if(id == "starcraft2" && item.starcraft2 != undefined){
                    makeMemberCard(item, item.starcraft2);
                }
                else if(id == "streetfighter5" && item.streetfighter5 != undefined){
                    makeMemberCard(item, item.streetfighter5);
                }
                else if(id == "warframe" && item.warframe != undefined){
                    makeMemberCard(item, item.warframe);
                }
                else if(id == "worldofwarcraft" && item.worldofwarcraft != undefined){
                    makeMemberCard(item, item.worldofwarcraft);
                }
            }
        });
    };
    
    GetJson(lambdaFunction, MembersDataFile);
}
