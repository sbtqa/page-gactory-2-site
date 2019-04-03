function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function updateURL(version) {
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?version=' + version;
        window.history.pushState({path:newurl},'',newurl);
    }
  }

function iframeHash() {
    window.location.hash = document.getElementById('doc').contentWindow.location.hash;
}


function iframeHashListener() {
    const iframeWindow = document.getElementById('doc').contentWindow;
    iframeWindow.document.body.addEventListener("hashchange", iframeHash);
    iframeWindow.addEventListener("hashchange", iframeHash);
}

function setVersion(version) {
    document.title = "TAG documentation (" + version + ")";
    if(getParameterByName('version') !== version) {
        updateURL(version);
    }
    $('#doc').attr("src", "releases/" + version + "/index.html" + window.location.hash);
}


$.getJSON("https://api.github.com/repositories/172893709/contents/releases", function (data) {
    const options = [];
    $.each(data, function (key, version) {
        options.push(version.name);
    });
    $('#versions').selectmenu({
        change: function (event, ui) {
            setVersion(ui.item.value);
        }
    });
    $('#versions')
    .append(options.map(function (version) { return "<option value=" + version + ">" + version + "</option>" }).join(""));
    
    const latestRelease = options.length > 1 ? options[options.length - 2] : "snapshot";  
    const queryVersion = getParameterByName('version');  
    const version = queryVersion && options.indexOf(queryVersion) > -1 ? queryVersion : latestRelease;

    $('#versions').val(version);
    $('#versions').selectmenu("refresh");
    setVersion(version);
    window.location.hash = "";
});
