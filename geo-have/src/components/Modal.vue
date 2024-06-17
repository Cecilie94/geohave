<!-- Logik for modal -->

<script setup>
const emit = defineEmits(["close", "okClicked", "handleOuterClick"]);
const props = defineProps(["modalActive"]);
const close = () => {
  emit("close");
};

// klikker ved siden af = luk modal (ude af drift)
const handleOuterClick = (event) => {
  if (event.target.classList.contains("modal")) {
    emit("handleOuterClick");
    close();
  }
};

const okClicked = () => {
  emit("okClicked");
  close();
};
</script>

<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="modalActive" class="modal-inner" @click.stop>
          <!-- import modal component and insert content -->
          <slot />
          <button @click="okClicked" type="button">OK</button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.modal {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-inner {
  position: relative;
  background-image: linear-gradient(#87a669, #2c5e36);
  color: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  width: 80%;
  max-width: 400px;
  margin: auto;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}

button {
  width: 189px;
  height: 44px;
  background-color: var(--primary-yellow);
  font-weight: bold;
  border: none;
  border-radius: 4px;
  font-family: "Kamerom", serif;
  font-size: 20px;
  margin: auto;
  display: block;
}

button:hover {
  background-color: var(--btn-on-click-yellow);
}

span {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: red;
  }
}

img {
  width: 80%;
  height: auto;
}

.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
