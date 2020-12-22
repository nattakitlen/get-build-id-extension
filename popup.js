const buildIdEl = document.getElementById('buildIdText')
const envNameEl = document.getElementById('envName')
const siteNameEl = document.getElementById('siteName')

function logMessage(msg) {
  chrome.tabs.executeScript({ code: `console.log('${msg}')` })
}

function getDataNextPage() {
  const nextDataScript = document.getElementById('__NEXT_DATA__')

  if (nextDataScript) {
    const nextDataString = nextDataScript.innerHTML
    const jsonNextData = JSON.parse(nextDataString)

    const buildId = jsonNextData.buildId
    const envName = jsonNextData.runtimeConfig.DMPENV
    const [siteName] = window.location.hostname.split('.')

    return { buildId, envName, siteName }
  }

  return null
}

chrome.tabs.executeScript(
  {
    code: `(${getDataNextPage})()`,
  },
  function (result) {
    const [{ buildId, envName, siteName }] = result
    buildIdEl.setAttribute('value', buildId)
    siteNameEl.innerHTML = siteName.charAt(0).toUpperCase() + siteName.substr(1).toLowerCase()
    envNameEl.innerHTML = envName
  }
)

document.getElementById('copyButton').onclick = function () {
  const buildId = buildIdEl.getAttribute('value')
  const el = document.createElement('textarea')
  el.value = buildId
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)

  document.querySelector('.octicon-clippy').classList.add('hide-sm')
  document.querySelector('.octicon-check').classList.remove('hide-sm')

  setTimeout(function () {
    document.querySelector('.octicon-clippy').classList.remove('hide-sm')
    document.querySelector('.octicon-check').classList.add('hide-sm')
  }, 1500)
}
