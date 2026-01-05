import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import sendResponse from "../../middleware/sendresponse";
import { uploadProductImages, vendorservice } from "./vendor.service";
import prisma from "../../utils/prisma";
import cloudinary from "../../utils/cloudinary";

const applyvendor = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.applyvendor(
    (req as any).user.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "vendor apply success",
    data: result,
  });
});

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getDashboard((req as any).user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get dashboard success",
    data: result,
  });
});

// controllers/vendor.controller.ts

export const createProductController = async (req: any, res: any) => {
  try {
    const { name, price, stock, description, categoryid, brandid } = req.body;
    const userid = req.user.id;

    // 🔹 Find or create vendor
    let vendor = await prisma.vendor.findUnique({ where: { userid } });
    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          userid,
          shopname: "Default Shop",
          status: "PENDING",
        },
      });
    }

    // Validate category & brand
    const category = await prisma.category.findUnique({
      where: { id: categoryid },
    });
    if (!category)
      return res.status(400).json({ message: "Category not found" });

    const brand = await prisma.brand.findUnique({ where: { id: brandid } });
    if (!brand) return res.status(400).json({ message: "Brand not found" });

    // Create product
    const product = await prisma.product.create({
      data: {
        vendorid: vendor.id,
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        categoryid,
        brandid,
      },
    });

    // Upload images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        await prisma.productimage.create({
          data: { productid: product.id, url: upload.secure_url },
        });
      }
    }

    return res.status(201).json(product);
  } catch (err: any) {
    console.error("CREATE PRODUCT ERROR:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

// controllers/vendor.controller.ts

export const getVendorProductsController = async (req: any, res: any) => {
  try {
    const userid = req.user.id;

    // 1️⃣ Find vendor
    const vendor = await prisma.vendor.findUnique({ where: { userid } });
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    // 2️⃣ Fetch products of this vendor
    const products = await prisma.product.findMany({
      where: { vendorid: vendor.id },
      include: {
        productimage: true, // fetch images
      },
      orderBy: { price: "desc" },
    });

    // 3️⃣ Map image
    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.productimage[0]?.url || "/placeholder.png", // first image or placeholder
      status: p.status,
    }));

    res.status(200).json(formattedProducts);
  } catch (err: any) {
    console.error("GET VENDOR PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const getProductByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Product ID is required" });

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productimage: true,
        Category: true,
        Brand: true,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json(product);
  } catch (err: any) {
    console.error("GET PRODUCT BY ID ERROR:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  
  // Only update fields if they exist (optional update)
  const { name, price, stock, description, categoryid, brandid } = req.body;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name && { name }),
      ...(price && { price: Number(price) }),
      ...(stock && { stock: Number(stock) }),
      ...(description && { description }),
      ...(categoryid && { categoryid }),
      ...(brandid && { brandid }),
    },
  });

  // Upload new images
  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      await prisma.productimage.create({
        data: {
          productid: productId,
          url: upload.secure_url,
        },
      });
    }
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});



const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.deleteProduct((req as any).params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "delete product success",
    data: result,
  });
});

// stock
const updateStock = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updatestock(
    (req as any).params.id,
    req.body.stock
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update stock  success",
    data: result,
  });
});

// offer

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.createoffer(
    (req as any).params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "create offer success",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getorder((req as any).user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get orders success",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updateorder(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update order success",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update order status success",
    data: result,
  });
});

// returns

const getReturns = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getReturns((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get returns success",
    data: result,
  });
});

const updateReturnStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.updatereturn(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "update return status  success",
    data: result,
  });
});

// refunds

const getrefund = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getRefunds((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get refund success",
    data: result,
  });
});

// sates report

const getSales = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getsales((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get sales success",
    data: result,
  });
});

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getrevenue((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get revenue success",
    data: result,
  });
});

const getInventoryStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getinventorystatus((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get inventory status  success",
    data: result,
  });
});

const getOrderPerformance = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getorderperformance((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get order performance  success",
    data: result,
  });
});

const getChats = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorservice.getchats((req as any).user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "get chats  success",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await vendorservice.getOrderById(
    (req as any).user.id,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "get order by id success",
    data: result,
  });
});

export const vendorController = {
  applyvendor,
  getDashboard,
  //   createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  createOffer,
  getOrders,
  updateOrder,
  updateOrderStatus,
  getReturns,
  updateReturnStatus,
  getrefund,
  getSales,
  getRevenue,
  getInventoryStatus,
  getOrderPerformance,
  getChats,
  getOrderById
  //   uploadImages
};
