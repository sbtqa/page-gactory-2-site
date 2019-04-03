function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
        window.location= UpdateQueryString('version', version);
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
    const version = queryVersion && options.indexOf(queryVersion) ? queryVersion : latestRelease;

    $('#versions').val(version);
    $('#versions').selectmenu("refresh");
    setVersion(version);
    window.location.hash = "";
});
