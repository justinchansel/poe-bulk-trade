'use strict';

import {getWhisperRow, injectBulkOptions, copyToClipboard} from './util.js';

console.log('content me captain');

window.addEventListener("load", main, false);

function main(evt) {
    var btnSelector = "#trade > div.top > div.controls > div.controls-center > button"
    var init = setInterval(onInit, 111);
    function onInit() {
        if($(btnSelector).is(":visible")) {
            clearInterval(init);
            console.log('button loaded?');
            console.log('do wait for search');
            var resultSelector = "div.resultset > div > div.left";
            var interval = setInterval(onSearch, 111);
            function onSearch() {
                if($(resultSelector).is(":visible")) {
                    clearInterval(interval);
                    console.log("search finished");

                    // Setup reloading on scroll
                    var reloadBulk = _.debounce(onReload, 500);
                    $("#trade > div.results.compact.two > div.resultset").on('DOMNodeInserted DOMNodeRemoved', reloadBulk);

                    // Inject bulk sort buttons
                    injectBulkOptions($);

                    var baseTypeName = $("#trade > div:nth-child(5) > div.search-panel > div:nth-child(1) > div.search-left > div > div.multiselect__tags > input").val();

                    $("#trade > div.top > div.controls > div.controls-center > button").click(function() {
                        $("#bulk_whisper_rows").empty("");
                    });

                    // Extract info from list of whispers and combine into list
                    function onReload(e) {
                        console.log('onReload');
                        $("#bulk_whisper_rows").empty("");

                        var data = $("#trade > div.results.compact.two > div.resultset > div").map(function(i, v) {
                            var username = $(v).find("div.right > div > div.btns > span > span.character-name").text();
                            username = username.replace("IGN: ", "");
                            var currency = $(v).find("div.right > div > div.price > span > span.currency-text.currency-image > span").text();
                            var price = $(v).find("div.right > div > div.price > span > span:nth-child(3)").text();
                            var status = $(v).find("div.right > div > div.btns > span > span.status.status-online").text();
                            status = $.trim(status);
                            var baseType = $(v).find("div.itemName.typeLine > span.lc").text();
                            baseType = $.trim(baseType);
                            var receiveImg = $(v).find("div.left > div > div > div.icon > img").attr("src");
                            var currencyImg = $(v).find("div.right > div > div.price > span > span.currency-text.currency-image > img").attr("src");
                            var enchant = $(v).find("span.lc.s[data-field*='stat.enchant']").text();
                            if(enchant.length > 0) {
                                enchant = enchant.replace(/Adds [0-9] Passive Skills/, "");
                                enchant = enchant.replace(/Added Small Passive Skills grant: /, "");
                            } else {
                                enchant = "N/A";
                            }

                            return {
                                "user": username,
                                "currency": currency,
                                "price": price,
                                "status": status,
                                "baseType": baseType,
                                "receiveImg": receiveImg,
                                "currencyImg": currencyImg,
                                "enchant": enchant
                            };
                        }).get();

                        var bulkUsers = {};
                        var whisperIndex = 0;
                        for(const d of data) {
                            if(!(d.user in bulkUsers)) {
                                bulkUsers[d.user] = {};
                                bulkUsers[d.user].count = 1;
                                bulkUsers[d.user].user = d.user;
                                bulkUsers[d.user].currency = d.currency;
                                bulkUsers[d.user].price = parseInt(d.price);
                                bulkUsers[d.user].status = d.status;
                                bulkUsers[d.user].baseType = d.baseType;
                                bulkUsers[d.user].initPrice = parseInt(d.price);
                                bulkUsers[d.user].receiveImg = d.receiveImg;
                                bulkUsers[d.user].currencyImg = d.currencyImg;
                                bulkUsers[d.user].index = whisperIndex;
                                bulkUsers[d.user].enchant = d.enchant;
                                whisperIndex++;
                                continue;
                            }
                            bulkUsers[d.user].count = bulkUsers[d.user].count + 1;
                            bulkUsers[d.user].price += parseInt(d.price);
                        }
                        var sortedUsers = Object.keys(bulkUsers).sort(function(a, b) {
                            return bulkUsers[a].count > bulkUsers[b].count ? -1 : 1;
                        }).map(function(i, v) {
                            return bulkUsers[i];
                        });

                        for(const data of sortedUsers) {
                            if(data.count < 2)
                                continue
                            console.log(`username: ${data.user}, count: ${data.count}`);
                            $("#bulk_whisper_rows").append(getWhisperRow(baseTypeName, data.price, data.count, data.user, data.status, data.receiveImg, data.currencyImg, data.index));
                            $("#bulk_whisper_" + data.index).click(function() {
                                var whisperText = `@${data.user} I'd like to buy your ${data.count} ${data.baseType} for my ${data.price} ${data.currency} in Delirium.`;

                                if(data.enchant !== "N/A") {
                                    whisperText = `@${data.user} I'd like to buy your ${data.count} ${data.enchant} ${data.baseType} for my ${data.price} ${data.currency} in Delirium.`;
                                }

                                console.log(whisperText);
                                copyToClipboard($, whisperText);
                                $("#bulk_whisper_" + data.index).text("Copied!");
                            });
                        }
                        // @NajSlow I'd like to buy your 6 Medium Cluster Jewel for my 150 Chaos Orb in Delirium.
                        // console.log(sortedUsers);
                    }
                }
            }
        }
    }
}