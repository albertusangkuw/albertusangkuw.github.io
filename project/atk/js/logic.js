var delayCounter = 3000;
const fullMonthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "October", "November", "Desember"];
const arrMonth = ['JAN','FEB','MAR','APR','MEI','JUNI','JULI','AGST','SEPT','OKT','NOV','DES'];
//Set Current Page for Sidebar
function setCurrentPage(){
    let hrefList = window.location.href.split('/');
    hrefList.splice(0, 3);
    let joinHref = hrefList.join("/");
    const navItemsElements = document.getElementsByClassName("nav-link");
    for (const i of navItemsElements){
        if("/"  + joinHref  == i.getAttribute("href")){
            i.classList.add("active");
            break;
        }
    }
}

// Input Number
function incrementValueInput(idInput ="", min="" , max=""){
    let el = document.getElementById(idInput);

    if(el == null){
        alert(`Element ID:${idInput} not found`);
        return;
    }
    let val = parseFloat(el.value)  + 1;
    if(min != false && min > val ){
        val = min;
    }
    if(max != false && max < val ){
        val = max;
    }
    el.value = val;
}

function decrementValueInput(idInput ="", min="" , max=""){
    let el = document.getElementById(idInput);
    if(el == null){
        alert(`Element ID:${idInput} not found`);
        return;
    }
    let val = parseFloat(el.value) - 1;
    if(min !== "" && min > val ){
        val = min;
    }
    if( max !== "" && max < val ){
        val = max;
    }
    el.value = val;
}

function enforceLimitValue(el){
    let min = parseInt(el.getAttribute('min'));
    let max = parseInt(el.getAttribute('max'));
    if(parseInt(el.value) < min){
        el.value = min;
    }
    if(parseInt(el.value) > max){
        el.value = max;
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
        const cached =ls.get(`${name}`);
        if(cached != null){
            return cached.data;
        }
        const newData = await requestData(name);
        ls.set(`${name}`,{ hit: -1, data:newData}, 3600000 );
        return newData;
    }
    const dataCache = ls.get(`${ref.id}`)
    if(dataCache != null && dataCache.hit == ref.hit){
        return dataCache.data;
    }


    try{
        const newData = await requestData(`/${name}${path}?x0_0=${ref.hit}${query}`);
        if(dataCache != null && JSON.stringify(newData) === JSON.stringify(dataCache.data)){
            return dataCache.data;
            //throw new CustomError('Same Data','Try Again');
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

// Simpan PDF
function generatePDF(el,filename){
    let doc = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [1020,1400],
        putOnlyUsedFonts: true,
    });
    console.log(el.offsetWidth);
    //target 770px+margin width
    window.html2canvas = html2canvas;
    doc.setFont('Arial','normal');
    doc.html(el,
        {
            callback: function (doc) {
                doc.save(filename);
            },
            x:10,
            y:10,

        });
}

// Get Value with Catch
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
    async pengguna(){
        this.config.columns = [
            {
                name: 'ID',
                width: '12%',
            },
            {
                name: 'Nama',
                width: '30%',
            },
            {
                name: 'Username',
                width: '30%',
            },
            {
                name: 'Dep.',
                width: '20%',
            },
            {
                name: 'Akses',
                width: '15%',
            },
            {
                name: 'Jabatan',
                width: '20%',
            },
            {
                name: 'Tanggal Buat Akun',
            },
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
                            <button onclick="modalEdit.pengguna('${row.cells[0].data}')"  class="btn btn-warning"
                             data-bs-toggle="modal" data-bs-target="#modal-edit" >
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>`),
                    gridjs.html(`
                            <button onclick="modalDelete.pengguna('${row.cells[0].data}')" class="btn btn-outline-danger"
                                    data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                               <i class="fa-solid fa-trash-can"></i>
                            </button>`)]
            }
            ,
        ];
        let data = await getData('pengguna');
        this.config.data = data.map(
            pengguna => [
                pengguna.id,
                pengguna.nama ,
                pengguna.username,
                getValueIf(pengguna.departemen, "nama", ""),
                pengguna.hak_akses,
                pengguna.jabatan,
                pengguna.created_at, null]);
        this.render(this.config);
    },
    async jenisBarang(){
        this.config.columns = [
            {
                name: 'Kode',
                width: '15%',
            },
            {
                name: 'Nama',
                width: '35%',
            },
            {
                name: 'Satuan',
                width: '15%',
            },
            {
                name: 'UPC (Universal Product Code)',
            },
            {
                name: 'Aksi',
                width: '15%',
                formatter: (_, row) =>[
                    gridjs.html(`
                        <button  onclick="modalEdit.jenisBarang('${row.cells[0].data}')" class="btn btn-warning"
                                data-bs-toggle="modal" data-bs-target="#modal-edit" >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>`),
                    gridjs.html(`
                        <button onclick="modalDelete.jenisBarang('${row.cells[0].data}')" class="btn btn-outline-danger"
                                data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                           <i class="fa-solid fa-trash-can"></i>
                        </button>`)]
            }
            ,
        ];
        let data = await getData('jenis_barang');
        this.config.data = data.map(
                jenisBarang => [
                    jenisBarang.kode,
                    jenisBarang.nama ,
                    jenisBarang.satuan,
                    jenisBarang.universal_product_code, null]);
        this.render(this.config);
    },
    async barang(){
        this.config.columns = ['ID', 'Periode', 'Stock', 'Status', 'Harga', 'Departemen', ' Jenis Barang',
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
                   <button onclick="modalEdit.barang('${row.cells[0].data}')" class="btn btn-warning"
                    data-bs-toggle="modal" data-bs-target="#modal-edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>`),
                    gridjs.html(`
                    <button onclick="modalDelete.barang('${row.cells[0].data}','id', '/barang/${row.cells[0].data}' )" class="btn btn-outline-danger"
                            data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
                       <i class="fa-solid fa-trash-can"></i>
                    </button>`)]
            }];
        let data = await getData('barang');
        const statusBarang = await getData('/barang/status');
        this.config.data = data.map(
            barang => [
                barang.id,
                barang.periode ,
                barang.stock,
                getValueIf(statusBarang.find(obj => {
                    return obj.int == barang.status;
                }), 'string', "" , undefined ),
                barang.harga,
                getValueIf(barang.departemen,key="nama",except="")  + "(" + barang.kode_departemen + ")" ,
                barang.jenis_barang.nama + "(" + barang.kode_jenis_barang  + ")", null]).reverse();
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
                formatter: (_, row) => gridjs.html(
                    getValueIf(row.cells[5].data,"",
                        `<a href="/permintaan/persetujuan/${row.cells[0].data}?redirect=/${currUser()}/permintaan" type="button" class="btn btn-secondary">
                                    <i class="fa-solid fa-clipboard-check"></i> Setujui Permintaan
                                </a>` , ""))
            },
            {
                name: 'Aksi',
                formatter: (_, row) =>
                    gridjs.html(`
                    <div style="width:180px">
                        <button onclick="modalPDF.permintaanHR146('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-pdf"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Download / Export ke PDF" >
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>
                        <button onclick="modalListBarang.permintaan('${row.cells[0].data}')" class="btn btn-info ml-1" data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"
                        data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Lihat Detail Barang">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </button>

                        <button onclick="modalEdit.permintaan('${row.cells[0].data}')" class="btn btn-warning ml-1"
                        data-bs-toggle="modal" data-bs-target="#modal-edit" data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Edit Data">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onclick="modalDelete.permintaan('${row.cells[0].data}')" class="btn btn-outline-danger ml-1"
                                data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete"  data-bs-tooltip="tooltip" data-bs-placement="bottom" title="Hapus/Batalkan Data">
                           <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>`),
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
    },
    async permintaanBarang(){
        this.config.columns = ['ID', 'Butuh', 'Keterangan',  'Jenis Barang' , 'Ref. Permintaan',
            {
                name: 'Aksi',
                formatter: (_, row) =>[
                    gridjs.html(`
            <button onclick="modalEdit.permintaanBarang('${row.cells[0].data}')" class="btn btn-warning"
            data-bs-toggle="modal" data-bs-target="#modal-edit" disabled>
                <i class="fa-solid fa-pen-to-square"></i>
            </button>`),
                    gridjs.html(`
            <button onclick="modalDelete.permintaanBarang('${row.cells[0].data}')" class="btn btn-outline-danger"
                    data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
               <i class="fa-solid fa-trash-can"></i>
            </button>`)]
            }
            ,
        ];
        let data = await getData('permintaan_barang');
        this.config.data = data.map(
            permintaanBarang => [
                permintaanBarang.id,
                permintaanBarang.kebutuhan  + " " + permintaanBarang.jenis_barang.satuan,
                permintaanBarang.keterangan,
                permintaanBarang.jenis_barang.nama + "(" + permintaanBarang.kode_jenis_barang + ")"  ,
                permintaanBarang.permintaan.tanggal_permintaan + " #" + permintaanBarang.id_permintaan,
                null]);
        this.render(this.config);
    },
    async tandaTerima(){
        this.config.columns =  ['ID', 'Tanggal Penerimaan', 'Penerima', {
            name: 'Pemberi',
            formatter: (_, row) => gridjs.html(
                getValueIf(row.cells[3].data,"",
                    `<a href="/tanda_terima/persetujuan/${row.cells[0].data}?redirect=/${currUser()}/tanda_terima" type="button" class="btn btn-secondary">
                        <i class="fa-solid fa-person-circle-question"></i> Setujui Penerimaan</a>` , "")
            )
        }, 'Departemen',
            {
                name: 'Aksi',
                formatter: (_, row) =>
                    gridjs.html(`
            <button onclick="modalPDF.permintaanHR149('${row.cells[0].data}')" class="btn btn-secondary ml-1"
                data-bs-toggle="modal" data-bs-target="#modal-pdf"  >
                    <i class="fa-solid fa-file-pdf"></i>
            </button>
            <button onclick="modalEdit.tandaTerima('${row.cells[0].data}')"  class="btn btn-warning"
            data-bs-toggle="modal" data-bs-target="#modal-edit" disabled >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="modalDelete.tandaTerima('${row.cells[0].data}')" class="btn btn-outline-danger"
                    data-bs-toggle="modal" data-bs-target="#modal-confirmation-delete">
               <i class="fa-solid fa-trash-can"></i>
            </button>
            `)
            }
            ,
        ];
        const data = await getData('tanda_terima');
        this.config.data =  data.map(
            tt => [
                tt.id,
                diffForHumans(Date.parse(tt.tanggal)),
                tt.penerima_barang.nama,
                getValueIf(tt.pemberi_barang,"nama",""),
                tt.departemen.nama + " (" +  tt.kode_departemen+ ")",
                null]).reverse();
        this.render(this.config);
        this.instance.on('ready', ()=>refreshToolTip());
    },
}

function downloadPDF(){
   const body = document.getElementById("modal-body-pdf");
   if(body == null){
       console.log("Modal body not found");
       return;
   }
   const title = document.getElementById("modal-title-pdf");
   generatePDF(body,title.innerText);
}

const main = ()=>{
    setCurrentPage();
}
