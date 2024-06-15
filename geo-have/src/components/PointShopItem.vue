<template>
  <div class="point-shop-item">
      <div class="point-shop-item-point">
        {{ points }}</div>
      <div class="point-shop-item-icon">
        <img v-if="icon === 'soda'"
          src="../assets/icons/Soda.svg"
        />
        <img v-if="icon === 'icecream'"
          src="../assets/icons/IceCream_.svg"
        />
        <!-- <i v-if="icon === 'ticket'" class="material-icons">confirmation_number</i> -->
        <img v-if="icon === 'ticket'"
          src="../assets/icons/Ticket.svg"
        />
        <img v-if="icon === 'lego'"
          src="../assets/icons/lego.svg"
        />
      </div>
      <div class="point-shop-item-text">
        {{ text }}
      </div>
      <div class="point-shop-item-text-tal">
        {{ uses }}/{{ max }}
      </div>
    </div>  
</template>

<script setup>
  defineProps(["icon","points","text","uses","max"])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
.point-shop-item{
  width: 157px;
  height: 184px;
  background-color: var(--primary-green);
  justify-content: center;
  margin: 0px 10px 30px 10px;
  border-radius: 3px;
  position: relative;
}

.point-shop-item-icon{
  display: flex;
  align-items: center;
  justify-content: center;
 height: 65%;
 margin: 0px;
}

.point-shop-item-text {
  background-color: var(--background-color);
  color: var(--color-text);
  height: 35%;
  box-shadow: 1px 1px 1px 1px rgba(186, 183, 183, 0.5);
  border-radius: 3px;
  color: rgb(25, 25, 25);
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  padding: 10px 20px 10px 20px;
}

.point-shop-item-point {
  width: 50px;
    height: 30px;
    background-color: var(--primary-yellow);
    justify-content: center;
    text-align: center;
    align-items: center; 
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    color: rgb(25, 25, 25);
    margin: 6px;
   position: absolute;
   right: 0;
}

.point-shop-item-text-tal{
  font-family: "Open Sans", sans-serif;
    font-weight: 700;
    font-size: 12px;
    color: rgb(25, 25, 25);
    justify-content: center;
    text-align: end;
    margin-right: 6px;
    position: relative; top: -20px;
}
</style>
