const navItemsElements = document.getElementsByClassName("nav-link");
const elModalEditData = document.getElementById('modal-edit');
const elFormModalInput = document.getElementById('modal-form-input');
// const modalDetailDaftarBarang  = new bootstrap.Modal(document.getElementById('modal-detail-daftar-barang'))
const elDetailDaftarBarang = document.getElementById("body-detail-daftar-barang");

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
                <input onkeyup="checkInputEnableButtonSubmit(this,${idData},'btnDeleteConfirm')"
                       id="validationPenghapusData" autocomplete="off" type="text" class="form-control was-validated"
                       name="kode" placeholder="${idData}" required>
                <div class="valid-feedback">
                    Tuliskan <code>${idData}</code>
                </div>
                `;
    }
}

