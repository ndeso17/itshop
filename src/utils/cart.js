import Swal from "sweetalert2";

/**
 * Add product to cart with duplicate detection
 * @param {Object} product - Product object with id, name, price, image, category
 * @param {Function} t - i18n translation function
 */
export const addToCart = (product, t) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      Swal.fire({
        icon: "warning",
        title: t("cart.exists"),
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1,
    };

    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    Swal.fire({
      icon: "success",
      title: t("cart.added"),
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    Swal.fire({
      icon: "error",
      title: t("cart.error"),
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

/**
 * Add product to wishlist with duplicate detection
 * @param {Object} product - Product object with id, name, price, image, category
 * @param {Function} t - i18n translation function
 */
export const addToWishlist = (product, t) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      Swal.fire({
        icon: "info",
        title: t("wishlist.exists"),
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    wishlist.push(newItem);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

    Swal.fire({
      icon: "success",
      title: t("wishlist.added"),
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    Swal.fire({
      icon: "error",
      title: t("wishlist.error"),
      timer: 1500,
      showConfirmButton: false,
    });
  }
};
