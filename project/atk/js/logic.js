var delayCounter = 3000;

//Set Current Page for Sidebar
function setCurrentPage(){
    let hrefList = window.location.href.split('/');
    hrefList.splice(0, 3);
    let joinHref = hrefList.join("/");
    for (const i of navItemsElements){
        if("/"  + joinHref  == i.getAttribute("href")){
            i.classList.add("active");
            break;
        }
    }
}

// Error Trigger
const CustomError = function(name,message) {
    this.name = name ;
    this.message = message;
    this.stack = (new Error()).stack;
}
// Cache System
const ls = {
    set: function (variable, value, ttl_ms) {
        const data = {value: value, expires_at: new Date().getTime() + ttl_ms / 1};
        localStorage.setItem(variable.toString(), JSON.stringify(data));
    },
    get: function (variable) {
        const data = JSON.parse(localStorage.getItem(variable.toString()));
        if (data !== null) {
            if (data.expires_at !== null && data.expires_at < new Date().getTime()) {
                localStorage.removeItem(variable.toString());
            } else {
                return data.value;
            }
        }
        return null;
    },
    remove: function (variable) {
        localStorage.removeItem(variable.toString());
    }
};
// Get Data
async function getData(name,path="",query="") {
    async function requestData(url){
        const data = await fetch(
            url, {
                method: 'GET',
            }
        )
        return data.json();
    }

    const ref = serverStatus.find((obj) => obj.id == name);
    if(ref == null){
        return requestData(name);
    }
    const dataCache = ls.get(`${ref.id}`)
    if(dataCache != null && dataCache.hit == ref.hit){
        return dataCache.data;
    }


    try{
        const newData = await requestData(`/${name}${path}?x0_0=${ref.hit}${query}`);
        if(dataCache != null && JSON.stringify(newData) === JSON.stringify(dataCache.data)){
            throw new CustomError('Same Data','Try Again');
        }
        ls.remove(`${ref.id}`);
        ls.set(`${ref.id}`,{ hit: ref.hit, data:newData}, 604800000);
        if(peringatan.remove(name) == true){
            peringatan.data(name, 'warning',
                `<i class="fa-solid fa-arrow-rotate-right"></i>
                            Silahkan Refresh/Reload Page ini untuk membuka data <b>${name.toUpperCase()}</b>
            `);
        }
        return newData;
    }catch(err){
        peringatan.data(name, 'danger',
            `<i class="fa-solid fa-triangle-exclamation"></i>
                    Data <b>${name.toUpperCase()}</b> gagal dibuka karena jaringan, Aplikasi akan mencoba dalam ${(delayCounter/1000).toFixed()} detik!
               `);
        console.log(`TryLoading data in ${delayCounter}s`);
        return  setTimeout(()=>{
            delayCounter = parseInt(delayCounter) + parseInt(((Math.random() * delayCounter).toFixed()));
            return getData(name,path,query);
        },delayCounter);
    }
}

function getValueIf(data,key="",except="",compare=null){
    if(data == compare){
        return except;
    }
    if(key == ""){
        return data;
    }
    return data[key];
}

// Table Instance
const tableInstance = {
    instance: null ,
    config: {
        columns: [],
        data: [],
        resizable: true,
        pagination: true,
        search: true,
        sort: true,
        style: {
            table: {
                'width': '100%'
            }
        },
        id_display: "table_display"
    },
    render(config){
        if(this.instance != null){
            this.instance.updateConfig(
                config
            ).forceRender();
        }else {
            this.instance = new gridjs.Grid(config).render(document.getElementById(config.id_display))
        }
    },
    async departemen(){
        this.config.columns = [
            {
                name: 'Kode',
                width: '20%',
            },
            {
                name: 'Nama',
                width: '60%',
            },
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
                                    <button onclick="modalEdit.departemen('${row.cells[0].data}')" class="btn btn-warning"
                                        data-bs-toggle="modal" data-bs-target="#modal-edit" >
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button onclick="modalDelete.departemen('${row.cells[0].data}')" class="btn btn-outline-danger"
                                            data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                                       <i class="fa-solid fa-trash-can"></i>
                                    </button>`)]
            }
            ,
        ];
        let data = await getData('departemen');
        this.config.data = data.map(departemen=> [departemen.kode, departemen.nama , null]);
        this.render(this.config);
    },
    async permintaan(){
        this.config.columns = [
            {
                name: 'ID',
                width: '12%',
            },
            {
                name: 'Tgl. Minta',
                width: '20%',
            },
            {
                name: 'Tenggat Wkt',
                width: '20%',
            },
            {
                name: 'Dep.' ,
                width: '12%',
            },
            {
                name:  'Diajukan' ,

            },
            {
                name:  'Disetujui',
                formatter: (_, row) => gridjs.html(lakukanPersetujuan(row.cells[5].data,row.cells[0].data))
            },
            {
                name: 'Aksi',
                formatter: (_, row) =>
                    gridjs.html(`
                <div style="width:180px">
                <button onclick="getPDF('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                data-bs-toggle="modal" data-bs-target="#modal-pdf"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Download / Export ke PDF" >
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
                <button onclick="showDaftarBarang('${row.cells[0].data}')" class="btn btn-info ml-1"
                data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Lihat Detail Barang"
                 >
                    <i class="fa-solid fa-boxes-stacked"></i>
                </button>

                <button onclick="refreshModalEdit('${row.cells[0].data}')" class="btn btn-warning ml-1"
                data-bs-toggle="modal" data-bs-target="#modal-edit" disabled  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Edit Data">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="modalConfirmDeletion('${row.cells[0].data}','id', '/permintaan/${row.cells[0].data}' )" class="btn btn-outline-danger ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Hapus/Batalkan Data">
                   <i class="fa-solid fa-trash-can"></i>
                </button></div>`),
            }
            ,
        ];
        let data = await getData('permintaan');
        this.config.data =  data.map(
            permintaan => [
                permintaan.id,
                permintaan.tanggal_permintaan ,
                permintaan.tenggat_waktu_barang,
                permintaan.departemen.nama,
                permintaan.pengguna_pengajuan.nama,
                getValueIf(permintaan.pengguna_persetujuan,"nama", "", null), null]).reverse();
        this.render(this.config);
        this.instance.on('ready', ()=>refreshToolTip());
    }
}



const main = ()=>{
    setCurrentPage();
}
