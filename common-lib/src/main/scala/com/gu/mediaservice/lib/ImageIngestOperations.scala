package com.gu.mediaservice.lib

import java.io.File
import scala.concurrent.Future
import com.amazonaws.auth.AWSCredentials

class ImageIngestOperations(imageBucket: String, thumbnailBucket: String, credentials: AWSCredentials)
  extends S3ImageStorage(credentials) {

  def storeOriginal(id: String, file: File, mimeType: Option[String], meta: Map[String, String] = Map.empty) =
    storeImage(imageBucket, fileKeyFromId(id), file, mimeType, meta)

  def storeThumbnail(id: String, file: File, mimeType: Option[String]) =
    storeImage(thumbnailBucket, fileKeyFromId(id), file, mimeType)

  def deleteOriginal(id: String) = deleteImage(imageBucket, fileKeyFromId(id))
  def deleteThumbnail(id: String) = deleteImage(thumbnailBucket, fileKeyFromId(id))

  def fileKeyFromId(id: String): String = id.take(6).mkString("/") + "/" + id
}
