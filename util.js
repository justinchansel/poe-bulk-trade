'use strict';

const injectBulkOptions = function(jQuery) {
    jQuery("#trade > div.results.compact.two").after(`<div class="results" style><div id="bulk_whisper_rows" class="resultset exchange"></div></div>`);
};

const getWhisperRow = function(baseTypeName, price, receiveCount, username, status, receiveImg, currencyImg, whisperId) {

    if(status.length < 1) {
        status = `class="status status-away">AFK`
    } else {
        status = `class="status status-online">Online`
    }

    return `
        <div class="row exchange">
            <div class="middle details">
                <div class="price">
                    <span class="price-left"><small>what you get</small>
                        <div class="price-block"><span class="currency-text">${baseTypeName}</span>&nbsp;
                            <img src="${receiveImg}" alt="chisel" title="chisel">
                            <span>&nbsp;×&nbsp;</span>
                            <span>${receiveCount}</span>
                        </div>
                    </span>
                    <span>⇐</span>
                    <span class="price-right">
                        <small>what you pay</small>
                        <div class="price-block">
                            <span>${price}</span>
                            <span>&nbsp;×&nbsp;</span>
                            <img src="${currencyImg}" alt="chaos" title="chaos">&nbsp;
                            <span class="currency-text">Chaos Orb</span>
                        </div>
                    </span>
                </div>
            </div>
        <div class="right">
            <div class="details">
                <div role="group" aria-label="Contact Options" class="btns">
                    <span class="pull-left">
                        <span title="Delirium" ${status}</span>&nbsp;
                        <span class="status">IGN: ${username}</span>&nbsp;
                        <button id="bulk_whisper_${whisperId}" class="btn btn-default">Whisper</button>
                        <button class="whisper-btn" style="display: none;"></button>
                    </span>
                    <div class="clear"></div>
                </div>
            </div>
        </div> <!---->
    `
};

const copyToClipboard = function(jQuery, text) {
    var $temp = jQuery("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

export {getWhisperRow, injectBulkOptions, copyToClipboard};