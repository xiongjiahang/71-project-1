const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

const searchMap = {
    'baidu': 'https://www.baidu.com/s?wd=',
    'bing': 'https://cn.bing.com/search?q='
}

let data = []
// const data = [{
//     title: '常用网站',
//     data: [
//         {
//             name: '饥人谷1',
//             url: 'https://jirengu.com'
//         }
//     ]
// }, {
//     title: '精品博客',
//     data: [
//         {
//             name: '阮一峰',
//             url: 'https://javascript.ruanyifeng.com'
//         }
//     ]
// }
// ]

let searchType = 'baidu'
let pageStatus = 'setting'

let curModifyIdx = 0
let $curModify = null

load()
$$('.search-tab').forEach($tab => {
    $tab.onclick = function () {
        $$('.search-tab').forEach($tab => $tab.classList.remove('active'))
        this.classList.add('active')
        searchType = this.dataset.type
    }
})

document.onkeyup = function (e) {
    if (e.key === 'Enter') {
        search()
    }
}

$('.icon-search').onclick = search
$('.icon-setting').onclick = function () {
    pageStatus = 'setting'
    $('body').classList.remove('preview')
    $('body').classList.add('setting')
}
$('.icon-back').onclick = function () {
    pageStatus = 'preview'
    $('body').classList.add('preview')
    $('body').classList.remove('setting')
}
$('.icon-plus').onclick = function () {
    $('.modal-1').classList.add('show')
}
$('.modal-1 .cancel').onclick = function () {
    $('.modal-1').classList.remove('show')
}
$('.modal-1 .confirm').onclick = function () {
    let value = $('.modal-1 input').value
    if (value === '') {
        alert('输入不能为空')
        return
    }
    let obj = {
        title: value,
        data: []
    }
    data.push(obj)
    render(data)
    save()
    $('.modal-1').classList.remove('show')
}

$('.modal-2 .cancel').onclick = function () {
    $('.modal-2').classList.remove('show')
}
$('.modal-2 .confirm').onclick = function () {
    let value = $('.modal-2 input').value
    if (value === '') {
        alert('输入不能为空')
        return
    }
    data[curModifyIdx].title = value
    render(data)
    save()
    $('.modal-2').classList.remove('show')
}

$('.modal-3 .cancel').onclick = function () {
    $('.modal-3').classList.remove('show')
}
$('.modal-3 .confirm').onclick = function () {
    let name = $('.modal-3 .site-name').value
    let url = $('.modal-3 .site-url').value
    if (name === '' || url === '') {
        alert('输入不能为空')
        return
    }
    data[curModifyIdx].data.push({ name, url })
    render(data)
    save()
    $('.modal-3').classList.remove('show')
}
$('.list').onclick = function (e) {
    let $delete = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-delete'))
    if ($delete) {
        let $result = e.composedPath().filter($node => $node.classList && $node.classList.contains('item'))
        if ($result.length > 0) {
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            console.log(index)
            data.splice(index, 1)
            render(data)
            save()
        }
        console.log($result)
    }
    let $edit = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-edit'))
    if ($edit) {
        let $result = e.composedPath().filter($node => $node.classList && $node.classList.contains('item'))
        if ($result.length > 0) {
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            curModifyIdx = index
            $curModify = $result
            $('.modal-2').classList.add('show')
            let title = $item.querySelector('h2').innerText
            $('.modal-2 input').value = title
        }
        console.log($result)
    }
    let $add = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-add'))
    if ($add) {
        let $result = e.composedPath().filter($node => $node.classList && $node.classList.contains('item'))
        if ($result.length > 0) {
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            curModifyIdx = index
            $curModify = $result
            $('.modal-3').classList.add('show')
        }
        console.log($result)
    }
    let $remove = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-remove'))
    if ($remove) {
        let $tag = $remove.parentElement
        let tagArr = [...$tag.parentElement.children]
        let tagIndex = tagArr.indexOf($tag)
        window.$remove=$remove
        console.log($tag)
        let $result = e.composedPath().filter($node => $node.classList && $node.classList.contains('item'))
        if ($result.length > 0) {
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            data[index].data.splice(tagIndex,1)
            save()
            $tag.remove()
        }
        console.log($result)
    }
}
function search() {
    let url = searchMap[searchType] + $('.search-input input').value
    const $link = document.createElement('a')
    $link.setAttribute('href', url)
    $link.setAttribute('target', '_blank')
    $link.click()
}
{/* 
    <li class="item">
        <h2>常用网站</h2>
        <ul class="panel">
            <li class="tag color-1">百度</li>
            <li class="tag color-2">知乎</li>
        </ul>
    </li>
    <li class="item">
        <h2>常用网站</h2>
        <ul class="panel">
            <li class="tag color-1">百度</li>
            <li class="tag color-2">知乎</li>
        </ul>
    </li>
 */}


render(data)

function render(data) {
    const $itemArr = data.map(obj => {
        const $item = document.createElement('li')
        $item.classList.add('item')
        const $h2 = document.createElement('h2')
        $h2.append(obj.title)
        const $iconSpan = document.createElement('span')
        $iconSpan.innerHTML = '<svg class="icon icon-delete" aria-hidden="true"><use xlink:href="#icon-delete_fill"></use></svg><svg class="icon icon-edit" aria-hidden="true"><use xlink:href="#icon-edit1"></use></svg>'
        $h2.append($iconSpan)
        const $ul = document.createElement('ul')
        $ul.classList.add('panel')
        let $liArray = obj.data.map(item => {
            const $tag = document.createElement('li')
            $tag.classList.add('tag')
            $tag.innerHTML = '<svg class="icon icon-remove" aria-hidden="true"><use xlink:href="#icon-delete_fill"></use></svg>'
            const $a = document.createElement('a')
            $a.setAttribute('href', item.url)
            $a.setAttribute('target', '_blank')
            $a.append(item.name)
            $tag.append($a)
            return $tag
        })
        $ul.append(...$liArray)
        let $icon = document.createElement('li')
        $icon.classList.add('tag')
        $icon.classList.add('icon-add')
        $icon.innerHTML = '<svg class="icon icon-add" aria-hidden="true"><use xlink:href="#icon-plus1"></use></svg>'
        $ul.append($icon)
        $item.append($h2, $ul)
        return $item
    })

    $('#websites .list').innerHTML = ''
    $('#websites .list').append(...$itemArr)
}

function save() {
    localStorage.setItem('website', JSON.stringify(data))
}
function load() {
    let storagedData = localStorage.getItem('website')
    if (storagedData) {
        data = JSON.parse(storagedData)
    } else {
        data = []
    }
}

