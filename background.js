/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function setMuted(tab, muted) {
    if (!tab.mutedInfo.muted && tab.mutedInfo.reason === "user") {
        // Never mute a tab that was manually unmuted.
        return;
    }

    chrome.tabs.update(tab.id, {muted});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active)
        return;

    if (changeInfo.audible)
        setMuted(tab, true);
})

function updateInactive() {
    chrome.tabs.query({active: false, audible: true}, tabs => {
        tabs.forEach(tab => setMuted(tab, true));
    });
}

chrome.tabs.onActivated.addListener(({tabId}) => {
    chrome.tabs.get(tabId, tab => {
        setMuted(tab, false);
    });

    updateInactive();
})

updateInactive();
