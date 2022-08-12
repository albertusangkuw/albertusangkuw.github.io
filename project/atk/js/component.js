var tooltipTriggerList = [];
var tooltipList = [];

function refreshToolTip(){
    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
    tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
const elFormModalInput = document.getElementById('modal-form-input');

function checkInputEnableButtonSubmit(el,valueCheck = "", btnConfirmID = "") {
    const btnHapusConfirm = document.getElementById(btnConfirmID);
    if(el.value == valueCheck){
        btnHapusConfirm.disabled = false;
    }else{
        btnHapusConfirm.disabled = true;
    }
}

function toggleSidebar() {
    const elSidebar = document.getElementById('sidebarMenu');
    const elMainContent = document.getElementsByTagName('main')[0];
    if(elSidebar.style.display == 'none'){
        elSidebar.style.display = null;
        elSidebar.classList.add('d-md-block');
        elMainContent.classList.remove("col-12");
        elMainContent.classList.add("col-md-9");
    }else{
        elSidebar.style.display = 'none';
        elSidebar.classList.remove('d-md-block');
        elMainContent.classList.add("col-12");
        elMainContent.classList.remove("col-md-9");
        elMainContent.classList.remove("col-lg-9");
    }
}

const peringatan = {
    data: function(konteks, jenisPeringatan, htmlData){
        const elPg = document.getElementById('progress-notif');
        if (elPg == null) {
            return;
        }
        let elData = document.getElementById( `progress-notif-${konteks}`);
        if(elData == null){
          elData = document.createElement("div");
        }
        elData.id = `progress-notif-${konteks}`;
        elData.innerHTML = `
             <div class="row d-flex justify-content-center px-2">
                <div class="alert alert-${jenisPeringatan}" role="alert" style="max-width:768px;">
                    ${htmlData}
                </div>
            </div>
         `;
        elPg.appendChild(elData);
    },
    remove: function (konteks) {
        const elPg = document.getElementById( `progress-notif-${konteks}`);
        if (elPg == null) {
            return false;
        }
        elPg.remove();
        return true;
    }
}

const modalEdit = {
    elFormEdit(){
       return  document.getElementById('modal-form-edit');
    },
    elInputEdit(){
        return  document.getElementById('modal-form-input');
    },
    async departemen(idData){
        const deptArr  = await getData('departemen');
        const departemen = deptArr.find((dep)=> dep.kode == idData);
        this.elFormEdit().action = `/departemen/${idData}`;
        this.elInputEdit().innerHTML =
            `
               <div class="col-12">
                    <label for="kode_update" class="form-label">Kode Departemen</label>
                    <input type="text" class="form-control" id="kode_update" name="kode" autocomplete="off" value="${departemen.kode}" required>
                </div>

                <div class="col-12">
                    <label for="nama_update" class="form-label">Nama Departemen</label>
                    <input type="nama" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${departemen.nama}" required>
                </div>

            `;
    },
    async pengguna(idData){
        const penggunaArr  = await getData('pengguna');
        const pengguna = penggunaArr.find((p)=> p.id == idData);
        this.elFormEdit().action = `/pengguna/${idData}`;
        this.elInputEdit().innerHTML =
            `  <div class="col-12">
                    <label for="nama_update" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${pengguna.nama}"  required>
                </div>
               <div class="col-12">
                        <label for="usernama_update" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username_update" name="username" autocomplete="off" value="${pengguna.username}"  required>
                </div>
               <div class="col-12">
                        <label for="password_update" class="form-label">Ganti Password</label>
                        <input type="password" class="form-control" id="password_update" name="password" >
                </div>
               <div class="col-12">
                    <label for="select_hak_akses_update" class="form-label">Hak Akses</label>
                    <select id="select_hak_akses_update"  name="hak_akses" data-placeholder="Pilih Hak Akses"  autocomplete="off"  required>
                    </select>
               </div>
               <div class="col-12">
                    <label for="jabatan_update" class="form-label">Jabatan</label>
                    <input type="text" class="form-control" id="jabatan_update" name="jabatan" value="${pengguna.jabatan}" autocomplete="off"  required>
               </div>
               <div class="col-12">
                    <label for="select_departemen_update" class="form-label">Departemen (Opsional)</label>
                    <select  id="select_departemen_update"  name="departemen" data-placeholder="Pilih Departemen"  autocomplete="off">
                    </select>
               </div>
            `;
        const departemenSelect  = new TomSelect('#select_departemen_update',settingsSelectDepartemen);
        const hakAksesSelect  = new TomSelect('#select_hak_akses_update',settingsHakAkses);
        if(pengguna.kode_departemen != null){
            departemenSelect.on('load',() => departemenSelect.setValue(pengguna.kode_departemen));
            departemenSelect.load();
        }
        hakAksesSelect.on('load',() => hakAksesSelect.setValue(pengguna.hak_akses));
        hakAksesSelect.load();
    },
    async jenisBarang(idData){
            const jbArr  = await getData('jenis_barang');
            const jb = jbArr.find((jb)=> jb.kode == idData);
            this.elFormEdit().action = `/jenis_barang/${idData}`;
            this.elInputEdit().innerHTML =
                `
                <div class="col-12">
                    <label for="nama_update" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="nama_update" name="nama" autocomplete="off" value="${jb.nama}" onchange="updateKodeUnik(this,'kode_update')"  required>
                </div>
                <div class="col-12">
                    <label for="kode_update" class="form_label">Kode Unik Barang</label>
                    <input type="text" class="form-control" id="kode_update" name="kode" value="${jb.kode}"  autocomplete="off"  required>
                </div>
                <div class="col-12">
                    <label for="satuan_update" class="form-label">Satuan</label>
                    <input type="text" class="form-control" id="satuan_update" name="satuan" value="${jb.satuan}" autocomplete="off"  required>
                </div>
                <div class="col-12">
                    <label for="universal_product_code_update" class="form-label">Universal Product Code</label>
                    <input type="text" class="form-control" id="universal_product_code_update" value="${getValueIf(jb.universal_product_code,"","")}" name="universal_product_code" autocomplete="off" >
                </div>
            `;
    },
    async barang(idData){
        const jbArr  = await getData('barang');
        const item = jbArr.find((jb)=> jb.id == idData);
        this.elFormEdit().action = `/barang/${idData}`;
        const periode = new Date(item['periode']);
        this.elInputEdit().innerHTML =
            `
                 <div class="col-12">
                            <label for="periode_update" class="form-label">Periode</label>
                            <input type="month" class="form-control" id="periode_update" name="periode" autocomplete="off" value="${ periode.toISOString().slice(0,7)}"  required>
                        </div>
                         <div class="col-12">
                            <label for="stock_update" class="form-label">Stock</label>
                            <div class="input-group">
                                <button class="btn btn-success" type="button" onclick="incrementValueInput('stock', 0)"><i class="fa-solid fa-plus"></i></button>
                                <input type="number" step="0.01" class="form-control" min="0" id="stock_update" name="stock"  value="${item['stock']}" autocomplete="off"  required>
                                <button class="btn btn-danger" type="button" onclick="decrementValueInput('stock', 0)"><i class="fa-solid fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="col-12">
                                <label for="select_status_update" class="form-label">Status</label>
                                <select id="select_status_update" name="status" autocomplete="off"  required>
                                </select>
                        </div>
                        <div class="col-12">
                            <label for="harga_update" class="form-label">Harga</label>
                            <div class="input-group">
                                <button class="btn btn-success" onclick="incrementValueInput('harga', 0)" type="button"><i class="fa-solid fa-plus"></i></button>
                                <input type="number" step="0.01"  class="form-control" id="harga_update" name="harga" min="0" value="${item['harga']}" required>
                                <button class="btn btn-danger" onclick="decrementValueInput('harga', 0)" type="button" ><i class="fa-solid fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="kode_departemen_update" class="form-label">Departemen</label>
                            <select name="kode_departemen" id="select_departemen_update"  data-placeholder="Ketik untuk mencari Departemen ..."  autocomplete="off">
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="select_jenis_barang_update" class="form-label">Jenis Barang</label>
                            <select name="kode_jenis_barang" id="select_jenis_barang_update" data-placeholder="Ketik untuk mencari Jenis Barang ..."  autocomplete="off">
                            </select>
                        </div>
            `;
        const statusSelect = new TomSelect('#select_status_update', settingsStatusBarang);
        const departemenSelect = new TomSelect('#select_departemen_update', settingsSelectDepartemen);
        const jenisBarangSelect = new TomSelect('#select_jenis_barang_update',settingsSelectJenisBarang );
        if (item['kode_departemen'] != null) {
            departemenSelect.on('load', () => departemenSelect.setValue(item['kode_departemen']));
            departemenSelect.load();
        }
        statusSelect.on('load', () => statusSelect.setValue(item['status']));
        statusSelect.load();
        jenisBarangSelect.on('load', () => jenisBarangSelect.setValue(item['kode_jenis_barang']));
        jenisBarangSelect.load();
    },
    async permintaan(idData){
        alert("Belum diImplementasi edit seperti gas departemen");
    },
    async permintaanBarang(idData){
        const jbArr  = await getData('permintaan_barang');
        const jb = jbArr.find((jb)=> jb.kode == idData);
        this.elFormEdit().action = `/permintaan_barang/${idData}`;
        alert('Belum Tersedia ', jb);
    },
    async tandaTerima(idData){
        const jbArr  = await getData('tanda_terima');
        const tt = jbArr.find((tt)=> tt.id == idData);
        this.elFormEdit().action = `/tanda_terima/${idData}`;
        alert('Belum Tersedia ', tt);
    },
};

const modalDelete = {
    elFormDelete(){
      return document.getElementById('modal-form-delete');
    },
    elInputDelete(){
        return document.getElementById('modal-body-delete');
    },
    async departemen(idData){
        this.elFormDelete().action = `/departemen/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="kode" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async pengguna(idData){
        this.elFormDelete().action = `/pengguna/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async jenisBarang(idData){
        this.elFormDelete().action = `/jenis_barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="kode" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async barang(idData){
        this.elFormDelete().action = `/barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async permintaan(idData){
        this.elFormDelete().action = `/permintaan/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async permintaanBarang(idData){
        this.elFormDelete().action = `/permintaan_barang/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async tandaTerima(idData){
        this.elFormDelete().action = `/tanda_terima/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
    async penyesuaianStok(idData){
        this.elFormDelete().action = `/penyesuaian_stok/${idData}`;
        this.elInputDelete().innerHTML = `
                <label for="validationPenghapusData" class="form-label">
                Tuliskan kembali <code>${idData}</code> untuk konfirmasi :</label>
                <input onkeyup="checkInputEnableButtonSubmit(this,'${idData}','btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="id" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    },
}

const modalListBarang = {
    modalBody(){
        return document.getElementById('body-detail-daftar-barang');
    },
    async permintaan(idPermintaan){

        const arrPermintaan = await getData('permintaan');
        const arrJenisBarang = await getData('jenis_barang');
        const permintaan = arrPermintaan.find((p)=> p.id == idPermintaan);
        if(permintaan == null){
            console.log("Permintaan Tidak Ada");
            return ;
        }
        this.modalBody().innerHTML = "";
        for(const minta_brg of permintaan.daftar_barang){
            const newNode = document.createElement("div");
            const jb = arrJenisBarang.find((jb)=> jb.kode == minta_brg.kode_jenis_barang );
            newNode.innerHTML = `
            <div class="card mb-3" >
                <div class="card-header d-flex justify-content-end">${minta_brg.kode_jenis_barang}</div>
                <div class="card-body text-dark">
                    <div class="form-floating">
                      <select class="form-select">
                        <option selected value="">${jb.nama}</option>
                      </select>
                      <label>Jenis Barang</label>
                    </div>
                    <div class="input-group mt-2">
                        <input type="number" step="0.01"  class="form-control" min="0" value="${minta_brg.kebutuhan}" disabled>
                        <button class="btn btn-outline-secondary" type="button" >${jb.satuan}</button>
                    </div>
                    <div class="form-floating mt-2">
                      <input type="text" class="form-control"  value="${minta_brg.keterangan}" disabled>
                      <label>Keterangan</label>
                    </div>
                </div>
            </div>`;
            this.modalBody().insertBefore(newNode, this.modalBody().children[0]);
        }
    },
    async tandaTerima(idTandaTerima){
        const arrTandaTerima= await getData('tanda_terima');
        const arrJenisBarang = await getData('jenis_barang');
        const tandaTerima = arrTandaTerima.find((tt)=> tt.id == idTandaTerima);
        if(tandaTerima == null){
            console.log("Tanda Terima Tidak Ada");
            return ;
        }
        this.modalBody().innerHTML = "";
        for(const minta_brg of tandaTerima.daftar_barang){
            const newNode = document.createElement("div");
            const jb = arrJenisBarang.find((jb)=> jb.kode == minta_brg.kode_jenis_barang );
            newNode.innerHTML = `
            <div class="card mb-3" >
                <div class="card-header d-flex justify-content-end">${minta_brg.kode_jenis_barang}</div>
                <div class="card-body text-dark">
                    <div class="form-floating">
                      <select class="form-select">
                        <option selected value="">${jb.nama}</option>
                      </select>
                      <label>Jenis Barang</label>
                    </div>
                    <div class="input-group mt-2">
                        <input type="number" step="0.01"  class="form-control" min="0" value="${minta_brg.jumlah}" disabled>
                        <button class="btn btn-outline-secondary" type="button" >${jb.satuan}</button>
                    </div>
                    <div class="form-floating mt-2">
                      <input type="text" class="form-control"  value="${minta_brg.keterangan}" disabled>
                      <label>Keterangan</label>
                    </div>
                </div>
            </div>`;
            this.modalBody().insertBefore(newNode, this.modalBody().children[0]);
        }
    },
    async penyesuaianStok(id){
        let dataPenyesuaian = await  getData('penyesuaian_stok');
        let ps = dataPenyesuaian.find((min) => min.id == id)
        let daftarJB = await getData('jenis_barang');
        if(ps == null){
            alert('Tidak ditemukan Tanda Terima');
            return;
        }
        this.modalBody().innerHTML = "";
        for(const brg of ps.daftar_barang){
            const newNode = document.createElement("div");
            const jb = daftarJB.find((jb)=> jb.kode == brg.kode_jenis_barang );
            newNode.innerHTML = `
            <div class="card mb-3" >
                <div class="card-header d-flex justify-content-end">${brg.kode_jenis_barang}</div>
                <div class="card-body text-dark">
                    <div class="form-floating">
                      <select class="form-select">
                        <option selected value="">${jb.nama}</option>
                      </select>
                      <label>Jenis Barang</label>
                    </div>
                    <div class="input-group mt-2">
                        <input type="number" step="0.01"  class="form-control" min="0" value="${parseFloat(brg.sebelum)-parseFloat(brg.sesudah)}" disabled>
                        <button class="btn btn-outline-secondary" type="button" >${jb.satuan}</button>
                    </div>
                    <div class="form-floating mt-2">
                      <input type="text" class="form-control"  value="${brg.keterangan}" disabled>
                      <label>Keterangan</label>
                    </div>
                </div>
            </div>`;
            this.modalBody().insertBefore(newNode, this.modalBody().children[0]);
        }
    }
}

const modalPDF = {
    modalBody(){
        return document.getElementById('modal-body-pdf');
    },
    modalTitle(){
        return document.getElementById('modal-title-pdf');
    },
    dataTable(page=1){
        return document.getElementById(`data-table-${page}-pdf`);
    },
    async permintaanHR146(id){
        const arrPermintaan = await getData(`permintaan`);
        const permintaan = arrPermintaan.find((p)=>p.id == id);

        let dateCurr = new Date();
        this.modalTitle().innerText = "Permintaan HR-146";
        if(permintaan == null){
            this.modalBody().innerHTML =  `Tidak ditemukan Permintaan`;
            return;
        }
        if(permintaan.pengguna_persetujuan == null){
            this.modalBody().innerHTML =  `Tidak didapat mengubah ke PDF harus dilakukan persetujuan terlebih dahulu`;
            return;
        }
        this.modalBody().innerHTML = "<hr";
        const datePermintaan = new Date(permintaan.tenggat_waktu_barang);
        const headerPDF = `
                <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-146</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
               </table>`;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${dateCurr.getDate()} ${fullMonthNames[dateCurr.getMonth()]} ${dateCurr.getFullYear()}</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Diajukan Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Disetujui Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${permintaan.pengguna_pengajuan.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${permintaan.pengguna_persetujuan.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>`;
        const dataFirstPDF = `
            <table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>FORM PERMINTAAN ALAT TULIS KANTOR(ATK)</b></td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">
                            <table  style="width:350px">
                                <tr>
                                    <td width="30%">Bulan</td>
                                    <td width="70%">: ${fullMonthNames[datePermintaan.getMonth()]} ${datePermintaan.getFullYear()}</td>
                                </tr>
                            </table>
                        </td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">
                            <table style="width:350px">
                                <tr>
                                    <td width="30%">Departemen</td>
                                    <td width="70%">: <b>${permintaan.departemen.nama}</b></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%">STOCK BARANG</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >KEBUTUHAN</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="12%" >TOTAL PERMINTAAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  width="30%" >KETERANGAN</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                    <tbody id="data-table-1-pdf">

                    </tbody>
                    ${footerPDF}
               </table>` ;
        const temp =this.modalBody();
        temp.innerHTML = `${headerPDF}<br>${dataFirstPDF}`;
        let counter = 1;
        let pages = 1;
        for (const brg of permintaan.daftar_barang) {
             this.dataTable(pages).insertAdjacentHTML('beforeend',
        `<tr>
                <td class='table-border-none' >&nbsp</td>
                <td class='table-border-full p-1' >${counter}</td>
                <td class='table-border-full p-1' colspan="4" >${brg.jenis_barang.nama}</td>
                <td  class='table-border-full p-1' colspan="2" >${brg.jenis_barang.satuan}</td>
                <td class='table-border-full p-1 text-center' colspan="2" >10</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >${brg.kebutuhan}</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >-99</td>
                <td class='table-border-full p-1'  >${brg.keterangan}</td>
                <td class='table-border-none' >&nbsp</td>
             </tr>
            `);
            counter++;
        }
    },
    async tandaTerimaHR149(id){
        const arrTandaTerima = await getData(`tanda_terima`);
        const tandaTerima = arrTandaTerima.find((tt)=>tt.id == id);

        let dateCurr = new Date();
        this.modalTitle().innerText = "Tanda TerimaHR-149";
        if(tandaTerima == null){
            this.modalBody().innerHTML =  `Tidak ditemukan Tanda Terima`;
            return;
        }
        if(tandaTerima.id_pengguna_penerima == null){
            this.modalBody().innerHTML =  `Tidak didapat mengubah ke PDF harus dilakukan persetujuan terlebih dahulu`;
            return;
        }
        const datePermintaan = new Date(tandaTerima.tanggal);
        const headerPDF = `
               <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-149</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:\t1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
               </table>`;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                      <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${ dateCurr.getDay() } ${ fullMonthNames[dateCurr.getMonth()] } ${ dateCurr.getFullYear() }</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Diserahkan Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Diterima Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${tandaTerima.pemberi_barang.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${tandaTerima.penerima_barang.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                `;
        const page1PDF = `
                <table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>FORM TANDA TERIMA</b></td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>DISTRIBUSI ALAT TULIS KANTOR(ATK)</b></td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table  style="width:350px"><tr><td width="30%">Bulan</td> <td width="70%">: ${ fullMonthNames[datePermintaan.getMonth()]} ${datePermintaan.getFullYear()}</td></tr></table></td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table style="width:350px"><tr><td width="30%">Departemen</td> <td width="70%">: <b>${ tandaTerima.departemen.nama }</b></td></tr></table></td>
                    </tr>
                     <tr>
                        <td class='table-border-none' width="1%" >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" rowspan="2" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" rowspan="2" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" rowspan="2"  >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%" rowspan="2">JUMLAH</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="15%" >DITERIMA</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="5" width="27%" rowspan="2" >KETERANGAN</td>
                        <td class='table-border-none' width="1%" >&nbsp</td>
                     </tr>
                     <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' colspan="2"  width="7%" style="background-color:#d0d0d0;" >YA</td>
                        <td class='table-border-full text-center'  colspan="2"   width="7%"style="background-color:#d0d0d0;" >TIDAK</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                     <tbody id="data-table-1-pdf">

                    </tbody>
                   ${footerPDF}
               </table>`;
        this.modalBody().innerHTML = `
                ${headerPDF}
               <br>
               ${page1PDF}
        `;
        let counter = 1;
        let pages = 1;
        const dataJB = await getData('jenis_barang');
        for (const brg of tandaTerima.daftar_barang) {
            let yes = '';
            let no = '';
            if( brg.status_penerimaan == 1){
                yes = '&#10003';
            }else{
                no = '&#10003';
            }
            let jb = dataJB.find(jb => jb.kode === brg.kode_jenis_barang );
            this.dataTable(pages).insertAdjacentHTML('beforeend', `
                    <tr>
                      <td class='table-border-none'>&nbsp</td>
                        <td class='table-border-full  p-1'>${counter}</td>
                        <td class='table-border-full  p-1' colspan="4">${jb.nama}</td>
                        <td  class='table-border-full  p-1' colspan="2">${jb.satuan}</td>
                        <td class='table-border-full  p-1 text-center' colspan="2">${brg.jumlah}</td>
                        <td  class='table-border-full  p-1 text-center' colspan="2">${yes}</td>
                        <td  class='table-border-full  p-1 text-center' colspan="2">${no}</td>
                        <td class='table-border-full  p-1'   colspan="5">${brg.keterangan}</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                    `);
            counter++;
        }
    },
    async penyesuaianStokHR147(id){
        const dataPenyesuaian = await getData(`penyesuaian_stok`);
        const penyesuaian = dataPenyesuaian.find((ps)=>ps.id==id);

        this.modalTitle().innerText = "Penyesuaian Stok HR-147";
        if(dataPenyesuaian == null){
            this.modalBody().innerHTML =  `Tidak ditemukan Penyesuaian`;
            return;
        }
        if(penyesuaian.persetujuan == null){
            this.modalBody().innerHTML =  `Tidak didapat mengubah ke PDF harus dilakukan persetujuan terlebih dahulu`;
            return;
        }

        const datePenyesuaian = new Date(penyesuaian.tanggal);
        const dateCurr = new Date();
        const headerPDF = `
           <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-147</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:\t1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
           </table>
        `;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>

                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${ dateCurr.getDay() } ${ fullMonthNames[dateCurr.getMonth()] } ${ dateCurr.getFullYear() }</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Dibuat Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Disetujui Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${penyesuaian.pembuat.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${penyesuaian.persetujuan.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
        `;
        const page1PDF = `
        <table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>FORM KARTU STOK ALAT TULIS KANTOR(ATK)</b></td>
                    </tr>
                     <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table  style="width:350px"><tr><td width="30%">Bulan</td> <td width="70%">: ${ fullMonthNames[datePenyesuaian.getMonth()]} ${datePenyesuaian.getFullYear()}</td></tr></table></td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table style="width:350px"><tr><td width="30%">Departemen</td> <td width="70%">: <b>${ penyesuaian.departemen.nama }</b></td></tr></table></td>
                    </tr>
                     <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%">STOCK BULAN LALU</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="16%" >PENGGUNAAN BULAN INI</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="8%" >SISA STOK</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  width="30%" >KETERANGAN</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                     <tbody id="data-table-1-pdf">

                    </tbody>
                    ${footerPDF}
               </table>
        `;
        this.modalBody().innerHTML = `
               ${headerPDF}
               <br>
               ${page1PDF}
        `;

        let counter = 1;
        let pages = 1;

        const dataJB = await getData('jenis_barang');
        for (const brg of penyesuaian.daftar_barang) {
            let tmpJB = dataJB.find((jb) => jb.kode == brg.kode_jenis_barang);
            this.dataTable(pages).insertAdjacentHTML('beforeend', `
             <tr>
                <td class='table-border-none' >&nbsp</td>
                <td class='table-border-full p-1' >${counter}</td>
                <td class='table-border-full p-1' colspan="4" >${tmpJB.nama}</td>
                <td  class='table-border-full p-1' colspan="2" >${tmpJB.satuan}</td>
                <td class='table-border-full p-1 text-center' colspan="2" >${brg.sebelum}</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >${parseInt(brg.sebelum) - parseInt(brg.sesudah)}</td>
                <td  class='table-border-full p-1 text-center' colspan="2" >${brg.sesudah}</td>
                <td class='table-border-full p-1'  >${brg.keterangan}</td>
                <td class='table-border-none' >&nbsp</td>
             </tr>
            `);
            counter++;
        }
    },
    async rekapitulasiPengadaanHR148(id){
        const daftarDep = [  'PROD','PURCH','PPIC','WH','TEK','PDQC','ACCT','HR','MKT','MFG','GM' ];
        let size = [1020,1400];
        //60 px per col  div min 35%;
        if(daftarDep.length > 7){
            size[0] += 60*(daftarDep.length-11);
            size[1] = size[0]+size[0]*0.35;
        }
        const headerPDF = `
           <table  class="pdf-table text-center"  cellspacing="0" cellpadding="0">
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                    </tr>
                    <tr>
                      <td  class='table-border-none'  colspan="10">PT. INDOFOOD CBP SUKSES MAKMUR Tbk</td>
                       <td class='table-border-left'  colspan="7"> Kode Form: HR-148</td>
                     </tr>
                     <tr>
                       <td class='table-border-none'  colspan="10">DIVISI NOODLE - PABRIK BANDUNG</td>
                       <td class='table-border-left' colspan="7">No. Terbitan:\t1.0</td>
                     </tr>
                    <tr>
                       <td class='table-border-none'  colspan="10">&nbsp</td>
                       <td class='table-border-left'  colspan="7">&nbsp</td>
                     </tr>
           </table>
        `;
        const footerPDF = `
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>

                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16">Padalarang, ${ dateCurr.getDay() } ${ fullMonthNames[dateCurr.getMonth()] } ${ dateCurr.getFullYear() }</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none text-center'  colspan="5">
                           Dibuat Oleh,

                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                        <td class='table-border-none text-center' colspan="3">
                            Disetujui Oleh,
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-top text-center' colspan="5">
                            ${penyesuaian.pembuat.nama}
                       </td>
                       <td class='table-border-none' colspan="7" >&nbsp</td>
                       <td class='table-border-top text-center' colspan="3">
                            ${penyesuaian.persetujuan.nama}
                       </td>
                       <td class='table-border-none' >&nbsp</td>
                    </tr>
                    <tr>
                        <td class='table-border-none' colspan="17" >&nbsp</td>
                    </tr>
        `;
        const page1PDF = `
        <table class="pdf-table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class='table-border-none' colspan="17" ><b>FORM REKAPITULASI</b></td>
                    </tr>
                    <tr>
                      <td  class='table-border-none' colspan="17" style="text-align:center"><b>PENGADAAN ALAT TULIS KANTOR (ATK)</b></td>
                    </tr>
                     <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table  style="width:350px"><tr><td width="30%">Bulan</td> <td width="70%">: ${ fullMonthNames[datePenyesuaian.getMonth()]} ${datePenyesuaian.getFullYear()}</td></tr></table></td>
                     </tr>
                    <tr>
                       <td class='table-border-none' >&nbsp</td>
                       <td class='table-border-none' colspan="16"><table style="width:350px"><tr><td width="30%">Departemen</td> <td width="70%">: <b>${ penyesuaian.departemen.nama }</b></td></tr></table></td>
                    </tr>
                     <tr>
                        <td class='table-border-none' >&nbsp</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" width="5%" >NO</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="4" width="20%" >JENIS BARANG</td>
                        <td  class='table-border-full text-center'  style="background-color:#d0d0d0;" colspan="2"width="12%" >SATUAN</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  colspan="2"  width="12%">STOCK BULAN LALU</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="16%" >PENGGUNAAN BULAN INI</td>
                        <td  class='table-border-full text-center' style="background-color:#d0d0d0;" colspan="2" width="8%" >SISA STOK</td>
                        <td class='table-border-full text-center' style="background-color:#d0d0d0;"  width="30%" >KETERANGAN</td>
                        <td class='table-border-none' >&nbsp</td>
                     </tr>
                     <tbody id="data-table-1-pdf">

                    </tbody>
                    ${footerPDF}
               </table>
        `;
        this.modalBody().innerHTML = `
               ${headerPDF}
               <br>
               ${page1PDF}
        `;
    },
    async laporanATKHR50(tahun){

    }
}

const permintaan = {
    counterTambahBarang: 0,
    showDetailBarang(data,attributeName,except) {
        if( attributeName in data){
            return data[attributeName];
        }
        return  except;
    },
    card(counter){
        return `
        <div class="card mb-3" id="card-id-${counter}">
                <div class="card-header d-flex justify-content-end">
                        <button type="button" class="btn btn-danger btn-sm" onclick="removeCardByID('card-id-${counter}')">
                        <i class="fa-solid fa-xmark"></i></button></div>
                <div class="card-body text-dark">
                    <select id="select-barang-${counter}" class="mb-1" placeholder="Cari Barang...." name="daftar_barang_${counter}" ></select>
                    <div class="input-group mb-1">
                        <button class="btn btn-success" onclick="incrementValueInput('kebutuhan-${counter}', 1)" type="button"><i class="fa-solid fa-plus"></i></button>
                        <input type="number" step="0.01"  class="form-control" id="kebutuhan-${counter}" name="daftar_kebutuhan-${counter}" min="0" value="1" required>
                        <button class="btn btn-outline-secondary" type="button" id='label-satuan-${counter}'></button>
                        <button class="btn btn-danger" onclick="decrementValueInput('kebutuhan-${counter}', 1)" type="button" ><i class="fa-solid fa-minus"></i></button>
                    </div>
                    <div class="form-floating">
                      <textarea class="form-control" placeholder="Tuliskan Keterangan disini" id="keterangan-${counter}"></textarea>
                      <label for="keterangan-${counter}">Keterangan</label>
                    </div>
                </div>
        </div>
        `;
    },
    optionList(item, escape){
        let namaBarang = '<span class="badge bg-warning text-dark">REQ Baru</span>';
        if( 'satuan' in item){
            namaBarang = item.nama
        }
        return `
               <div class="py-2 d-flex">
                    <div>
                        <div class="mb-1">
                            <span class="h4">
                                ${namaBarang}
                            </span>
                            <span class="text-muted">${  escape(item.kode) }</span>
                        </div>
                        <div class="description">
                            <span class="badge bg-primary"><i class="fa-solid fa-square-check"></i>  ${permintaan.showDetailBarang(item,"tersedia",'0') } tersedia</span>
                            <span class="badge bg-secondary"><i class="fa-solid fa-hand-holding-droplet"></i> ${ permintaan.showDetailBarang(item,"dipesan",'0') } dipesan</span>
                            <span class="badge bg-info text-dark"><i class="fa-solid fa-people-carry-box"></i> ${ permintaan.showDetailBarang(item,"diterima",'0') } diterima</span>
                        </div>
                    </div>
                </div>`;
    },
    create(elAddBtn){
        const elListBarangDiminta = document.getElementById("daftar-barang-diminta");
        if(this.counterTambahBarang == 0){
            elAddBtn.innerHTML = '<i class="fa-solid fa-circle-plus"></i> ';
        }
        this.counterTambahBarang += 1;
        const newNode = document.createElement("div");
        newNode.innerHTML = this.card(this.counterTambahBarang);
        elListBarangDiminta.insertBefore(newNode, elListBarangDiminta.children[0]);

        let templateSettings = settingsSelectJenisBarang;
        templateSettings.load = (query, callback)=> {
            var self = this;
            if (self.loading > 1) {
                callback();
                return;
            }
            getData('barang', '/supply_demand').then(data => {
                callback(data);

                self.settings.load = null;
            }).catch(() => {
                callback();
            });
        };
        templateSettings.create= true;
        templateSettings.maxOptions= 8;
        templateSettings.loadThrottle = 50;
        templateSettings.createFilter = (input) => input.length >= 5;
        templateSettings.onChange = async function(values){
            if(values.length <= 0 ) {
                return;
            }

            let idNum = this.control_input.id.split("-")[2];
            let dataJB= await getData('jenis_barang');
            let hasil = dataJB.find(i => i.kode === values);
            let satuan = "";
            if(hasil != null){
                satuan = hasil.satuan
            }
            document.getElementById(`label-satuan-${idNum}`).innerText = satuan ;
        };
        templateSettings.render= {
            option:  function(item, escape) { return permintaan.optionList(item, escape);},
            item: function(item, escape) { return permintaan.optionList(item, escape);},
        };
        const ts = new TomSelect(`#select-barang-${this.counterTambahBarang}`,templateSettings);
        ts.load();

        let elInput = document.getElementById(`select-barang-${this.counterTambahBarang}-ts-control`);
        if(elInput != null){
            elInput.style.fontSize= "1.3em";
        }
    },
    validate(){
        if(document.getElementById("checkKonfirmasiForm").checked == true){
            let tmpDataStore = []
            for(let i=1; i<=this.counterTambahBarang; i++){
                let elJenisBarang = document.getElementById(`select-barang-${i}`);
                if(elJenisBarang == null){
                    continue;
                }
                let elJmlBarang = document.getElementById(`kebutuhan-${i}`);

                if(elJenisBarang.value == "" || elJmlBarang.value < 1){
                    alert("Data Belum Terisi Sepenuhnya, Check Kembali");
                    return false;
                }
                let elDscBarang = document.getElementById(`keterangan-${i}`);

                tmpDataStore.push({
                    "kode_jenis_barang" : elJenisBarang.value,
                    "kebutuhan" : elJmlBarang.value,
                    "keterangan" : elDscBarang.value,
                });

            }
            document.getElementById("array_barang_diminta").value = JSON.stringify(tmpDataStore);
            return true;
        }
        return false;
    },
    show(permintaan){
        let newNode = document.createElement("div");
        newNode.classList.add('col');
        newNode.classList.add('mt-2');
        let textStatusPenerimaan = `
                            <dd class="col-lg-9 text-muted">
                                  <a href="/admin/terima_barang?id_permintaan=${permintaan.id}" type="button" class="btn  btn-warning w-100">
                                        <i class="fa-solid fa-people-carry-box"></i> Lakukan Penerimaan Barang
                                  </a>
                            </dd>`;
        let textPersetujuan = `<dd class="col-lg-9 text-muted">
                                    <button onclick="permintaan.lakukanPersetujuanQR('${permintaan.id}')" class="btn  btn-info w-100"
                                        data-bs-toggle="modal" data-bs-target="#modal-verifikasi-permintaan">
                                        <i class="fa-solid fa-clipboard-check"></i> Lakukan Persetujuan Permintaan
                                    </button>
                               </dd>`;
        let datePermintaan = new Date(permintaan.tanggal_permintaan);

        if(permintaan.id_pengguna_persetujuan != null){
            textPersetujuan =
                `<dd class="col-lg-9">
                        ${permintaan.pengguna_persetujuan.nama} (${permintaan.pengguna_persetujuan.jabatan})
                </dd>`;
        }else{
            textStatusPenerimaan = `
                <dd class="col-lg-9 text-muted">
                      Penerimaan dapat dilakukan jika sudah disetujui
                </dd>`;
        }

        if(permintaan.tanda_terima.length > 0){
            let optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let datePenerimaan = new Date(permintaan.tanda_terima[0].tanggal);
            textStatusPenerimaan = `<a href="/admin/terima_barang/${permintaan.id}">
                    Ref.${permintaan.tanda_terima[0].id} (${datePenerimaan.toLocaleDateString("id-ID", optionsDate)})</a>`;
        }
        newNode.innerHTML = `
            <div class="card w-100">
                    <div class="card-header d-flex justify-content-between"><div>DEP-${permintaan.kode_departemen}</div><div>#${permintaan.id}</div></div>
                    <div class="card-body">

                        <h5 class="card-title">
                            <small class="text-muted">${datePermintaan.getDate() }</small>
                            ${datePermintaan.toLocaleString('default', { month: 'long' })} ${datePermintaan.getFullYear()}
                        </h5>
                        <dl class="row card-text">
                            <dt class="col-lg-3">Tenggat Waktu Penerimaan Barang:</dt>
                            <dd class="col-lg-9 ">
                                 ${permintaan.tenggat_waktu_barang}
                            </dd>
                            <dt class="col-lg-3">Status Penerimaan Barang:</dt>
                                ${textStatusPenerimaan}
                            <dt class="col-lg-3">Diajukan:</dt>
                            <dd class="col-lg-9">
                                ${permintaan.pengguna_pengajuan.nama} (${permintaan.pengguna_pengajuan.jabatan})
                            </dd>
                            <dt class="col-lg-3">Disetujui:</dt>
                                ${textPersetujuan}
                            <dt class="col">
                                <button type="button" onclick="modalListBarang.permintaan('${permintaan.id}')"  data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"  class="btn btn-primary w-100"><i class="fa-solid fa-list"></i> Lihat Barang Diminta</button>
                            </dt>
                         </dl>
                    </div>
            </div>
        `;
        return newNode;
    },
    lakukanPersetujuanQR(idMinta){
    const qr = new QRious({
        element: document.getElementById('qr-setuju'),
        value: `/permintaan/persetujuan/${idMinta}?redirect=/`,
        size: 250,
    });
},
    async list(kodeDep){
        const elPermintaan = document.getElementById('permintaan-list-data');
        let arrPermintaan = await getData('permintaan', '' ,`?kode_departemen=${kodeDep}`);
        arrPermintaan = arrPermintaan.reverse();
        for(const permintaan of arrPermintaan){
            elPermintaan.appendChild(this.show(permintaan));
        }
    }
}

const terimaBarang = {
    jumlahDaftarBarang: 0,
    card(data,counter){
        return `
         <div class="card mb-3" id="card-id-${counter}">
                        <div class="card-header d-flex justify-content-between">
                            <div>DEP_${data.kode_departemen}  #${data.daftar_barang[counter].id}</div>
                            <div>

                            <button type="button" class="btn btn-danger btn-sm" onclick="removeCardByID('card-id-${counter}')">
                                    <i class="fa-solid fa-xmark"></i>
                                    </button>
                            </div>
                        </div>
                        <input type="hidden" id="id-permintaan-barang-${counter}" value="${data.daftar_barang[counter].id}">
                        <div class="card-body text-dark">
                            <select class="form-select" name="select-barang-${counter}"  id="select-barang-${counter}"  readonly>
                              <option selected value="${data.daftar_barang[counter].kode_jenis_barang}">${data.daftar_barang[counter].jenis_barang.nama}</option>
                            </select>
                            <div class="input-group mt-1">
                                <input type="number" step="0.01"  class="form-control" id="kebutuhan-${counter}" name="kebutuhan-${counter}" min="1" value="${data.daftar_barang[counter].kebutuhan}" required>
                                <button class="btn btn-outline-secondary" type="button" id='label-satuan-${counter}'>${data.daftar_barang[counter].jenis_barang.satuan}</button>
                            </div>
                            <div class="d-flex justify-content-between mt-1">
                                <label for="exampleInputEmail1" class="form-label">Diterima:</label>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions-${counter}" id="inlineYesRadio-${counter}" value="true">
                                    <label class="form-check-label" for="inlineRadio-${counter}">Ya</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions-${counter}" id="inlineNoRadio-${counter}" value="false">
                                    <label class="form-check-label" for="inlineRadio-${counter}">Tidak</label>
                                </div>
                            </div>
                            <div class="form-floating mt-1">
                                <textarea class="form-control"  placeholder="Tuliskan Keterangan disini" name="keterangan-${counter}" id="keterangan-${counter}" ></textarea>
                                <label for="keterangan-${counter}">Keterangan</label>
                            </div>

                        </div>
                    </div>
        `
    },
    optionList(item,escape){
        return `
                    <div class="py-2 d-flex">
                         <div>
                            <div class="mb-1">
                                <span class="h6">
                                    Tanggal Permintaan:
                                </span>
                                <span class="h4">
                                    ${ escape(item.tanggal_permintaan) }
                                </span>
                                <span class="text-muted">oleh ${ escape(item.pengguna_pengajuan.nama) }</span>
                            </div>
                            <div class="description">
                                <span class="h6">
                                    Ref. Permintaan #${ escape(item.id) }
                                </span>
                            </div>
                        </div>
                    </div>`;
    },
    async initForm(kodeDept){
        let queryKodeDep = "";
        if(kodeDept == null){
            queryKodeDep = `?kode_departemen=${kodeDept}`;
        }
        const arrPermintaan = await getData('permintaan', '' , queryKodeDep);
        let dataPermintaan = arrPermintaan.filter((p) => p.id_pengguna_persetujuan != null);

        let templatePermintaanSelect = settingsSelectPermintaan;
        templatePermintaanSelect.onChange = function(values) {
            if (values <= 0) {
                return;
            }
            document.getElementById('');

            terimaBarang.create(values);
        }
        //ToDo: Sorting Data Permintaan
        templatePermintaanSelect.options = dataPermintaan;
        templatePermintaanSelect.render =  {
            option: function(item, escape){return terimaBarang.optionList(item,escape)},
            item: function(item, escape){return terimaBarang.optionList(item,escape) },
        };
        const refMinta  = new TomSelect('#select-id-permintaan',templatePermintaanSelect);
        const url = new URL(window.location.href);
        if (url.searchParams.get('id_permintaan') != null) {
            refMinta .setValue(url.searchParams.get('id_permintaan'));
        }
    },
    async create(selectedID){
        const dataPermintaan = await getData('permintaan');
        const data = dataPermintaan.find(i => i.id == selectedID);
        const elDaftarBarangPermintaan = document.getElementById("daftar-barang-diminta");
        this.jumlahDaftarBarang = data.daftar_barang.length;
        elDaftarBarangPermintaan.innerHTML = `<div></div>`;
        for (let counterTambahBarang = 0; counterTambahBarang < data.daftar_barang.length; counterTambahBarang++) {
            const newNode = document.createElement("div");
            newNode.innerHTML = this.card(data,counterTambahBarang);
            elDaftarBarangPermintaan.insertBefore(newNode, elDaftarBarangPermintaan.children[0]);
        }
    },
    validate(){
        if(document.getElementById("checkKonfirmasiForm").checked == true){
            let tmpDataStore = []
            for(let i=0; i<this.jumlahDaftarBarang; i++){
                let elJenisBarang = document.getElementById(`select-barang-${i}`);
                if(elJenisBarang == null){

                    continue;
                }
                let elJmlBarang = document.getElementById(`kebutuhan-${i}`);

                if(elJenisBarang.value == "" && elJmlBarang.value < 1){
                    alert("Data Belum Terisi Sepenuhnya, Check Kembali");
                    return false;
                }
                let statusPenerimaan = document.querySelector(`input[name='inlineRadioOptions-${i}']:checked`);
                if(statusPenerimaan == null){
                    alert("Terdapat Penerimaan yang belum lengkap, Cek Kembali");
                    return false;
                }
                let elDscBarang = document.getElementById(`keterangan-${i}`);
                let elPermintaanBarang = document.getElementById(`select-barang-${i}`);


                tmpDataStore.push({
                    "id_barang" : elPermintaanBarang.value,
                    "jumlah" : elJmlBarang.value,
                    "status_penerimaan" : statusPenerimaan.value,
                    "keterangan" : elDscBarang.value,
                });

            }
            document.getElementById("array_barang_diterima").value = JSON.stringify(tmpDataStore);
            return true;
        }
        return false;
    },
    show(i,data){
        let newNode = document.createElement("div");
        newNode.classList.add('col');
        newNode.classList.add('mt-2');
        let textPersetujuan = `` ;
        let datePenerimaan = new Date(data[i].tanggal);
        let optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let datePermintaan = new Date(data[i].permintaan.tanggal_permintaan);

        if(data[i].pemberi_barang == null){
            textPersetujuan = `<button type="button" class="btn  btn-info w-100"><i class="fa-solid fa-clipboard-check"></i> Lakukan Persetujuan Penerimaan</button>`;
        }else{
            textPersetujuan = `${data[i].pemberi_barang.nama} (${data[i].pemberi_barang.jabatan})`;
        }
        newNode.innerHTML =   `
                <div class="card mb-3" id="card-id-">
                        <div class="card-header d-flex justify-content-between"><div>DEP-${data[i].kode_departemen}</div><div>#${data[i].id}</div></div>
                        <div class="card-body">
                            <h5 class="card-title">
                                <small class="text-muted">${datePenerimaan.getDate()}</small> ${datePenerimaan.toLocaleString('default', { month: 'long' })} ${datePenerimaan.getFullYear()}
                            </h5>
                            <dl class="row card-text">
                                <dt class="col-lg-3">Referensi Permintaan Barang:</dt>
                                <dd class="col-lg-9 text-muted">
                                    <a href="/pengelola/minta_barang/${data[i].id_permintaan}">Ref.${data[i].id_permintaan} (${datePermintaan.toLocaleDateString("id-ID", optionsDate)})</a>
                                </dd>
                                <dt class="col-lg-3">Penerima:</dt>
                                <dd class="col-lg-9">
                                    ${data[i].penerima_barang.nama} (${data[i].penerima_barang.jabatan})
                                </dd>
                                <dt class="col-lg-3">Pemberi:</dt>
                                <dd class="col-lg-9">
                                    ${textPersetujuan}
                                </dd>

                                <dd class="col">
                                <button type="button" onclick="modalListBarang.tandaTerima('${data[i].id}')"  data-bs-toggle="modal" data-bs-target="#modal-detail-daftar-barang"  class="btn btn-primary w-100">Lihat Barang Diterima</button>
                                </dd>
                            </dl>
                        </div>
                    </div>
        `;
        return newNode;
    },
    async list(kodeDep){
        let arrTerimaBarang = await getData('tanda_terima', '' ,`?kode_departemen=${kodeDep}`);
        let dataTerimaBarang = arrTerimaBarang.reverse();

        const elAllTerimaBarang = document.getElementById("all-terima-barang");

        //Redirection Modal
        const url = new URL(window.location.href);
        const ffDariPermintaan = url.searchParams.get('id_permintaan');
        if (ffDariPermintaan != null) {
            const res  = dataTerimaBarang.find((p)=> p.id_permintaan == ffDariPermintaan);
            if(res == null){
                const modalTambahTerima = new bootstrap.Modal(document.getElementById('modal-create'));
                modalTambahTerima.show();
            }
        }

        for(let i=0; i< dataTerimaBarang.length; i++) {
            elAllTerimaBarang.appendChild(this.show(i,dataTerimaBarang));
        }
    }
}


const penyesuaianBarang = {
    dataBarang: [],
    toggleKeteranganForm(el,idForm) {
        const element = document.getElementById(idForm);
        if(parseInt(el.getAttribute("original")) == parseInt(el.value)){
            element.classList.add("visually-hidden");
        }else{
            element.classList.remove("visually-hidden");
        };
    },
    validate(){
        const elInputHiddenBarang = document.getElementById('input_hidden_barang');
        const elCheckKonfirmasiForm = document.getElementById('checkKonfirmasiForm');

        if(elCheckKonfirmasiForm.checked == false){
            alert('Check Konfirmasi Form terlebih dahulu');
            return false;
        }
        let tmpValue = [];
        for(let i=0;i< this.dataBarang.length; i++){
            if(document.getElementById(`stock-${i}`) == null){
                continue;
            }
            let currentVal = parseInt(document.getElementById(`stock-${i}`).value);
            if(currentVal >= this.dataBarang[i].diterima || currentVal < 0 ) {
                continue;
            }
            tmpValue.push({
                kode:this.dataBarang[i].kode,
                sebelum: this.dataBarang[i].diterima,
                sesudah: currentVal,
                keterangan: document.getElementById(`keterangan-${i}`).value,
            });
        }
        elInputHiddenBarang.value = JSON.stringify(tmpValue);
        console.log(tmpValue);
        if(tmpValue.length == 0 ){
            alert("Setidaknya Harus ada Satu Jenis Barang disesuaikan");
            return false;
        }

        return true;
    },
    show(i,barang){
        let newNode = document.createElement("div");
        newNode.classList.add('col');
        newNode.classList.add('mt-2');
        newNode.innerHTML = `
                <div class="card" id="card-id-${barang.kode.replace(/\W/g,'_')}">
                    <div class="card-header d-flex justify-content-end"> ${barang.kode}</div>
                    <div class="card-body ">
                        <input class="form-control" type="text" value="${barang.nama}" readonly>
                        <div class="form-floating mt-1">
                          <input type="number" class="form-control" value="${barang.diminta}" disabled>
                          <label ><i class="fa-solid fa-hand-holding-droplet"></i> <b>Dalam Permintaan</b></label>
                        </div>
                        <div class="input-group mt-1">
                            <div class="form-floating " style="width: 60%">
                                <input type="number" original="${barang.diterima}" step="0.01" onchange="enforceLimitValue(this);" onblur="penyesuaianBarang.toggleKeteranganForm(this,'comment-form-${i}');"  class="form-control" id="stock-${i}"  min="0"  max="${barang.diterima}" value="${barang.diterima}" required>
                                <label for="floatingInput"> <i class="fa-solid fa-people-carry-box"></i> <b>Jumlah Diterima</b></label>
                            </div>

                            <button class="btn btn-outline-secondary"  style="width: 30%; font-size: small; padding: 0px" type="button" id='label-satuan-${i}'><b>${barang.satuan}</b></button>
                            <button class="btn btn-danger"  style="width: 10%" onclick="decrementValueInput('stock-${i}', 0)" type="button" ><i class="fa-solid fa-minus"></i></button>
                        </div>
                        <div class="visually-hidden mt-1" id='comment-form-${i}'>
                            <div class="form-floating">
                              <textarea class="form-control" placeholder="Tuliskan Keterangan disini..." id='keterangan-${i}'></textarea>
                              <label >Keterangan</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        return newNode;
    },
    async list(kodeDep,tableDisplay='table_display') {
        const data = await getData('barang', '/supply_demand', `?kode_departemen=${kodeDep}`);
        const elAllBarang = document.getElementById(tableDisplay);
        elAllBarang.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const barang = data[i];
            if (barang.diterima <= 0 && barang.diminta <= 0) {
                continue;
            }
            elAllBarang.appendChild(this.show(i, barang));
        }
        this.dataBarang = data;
        return data;
    }
}
